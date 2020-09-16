const dirTree = require("directory-tree");

var glob = require("glob");
const path = require("path");
jsonTree = {};
//"./dist/jstree.min.js"

class libNode {
  // create new class with Node feature
  constructor(
    self,
    text,
    fullPath,
    parent = false,
    track_data = false,
    topDir = false,
    children = false
  ) {
    //super(libNode, self).__init__()
    this.text = text; // what the User sees
    this.name = fullPath; // "d:/root/child" unique 'id'
    if (track_data) {
      // If it is a file
      // [id, name, type, size]
      this.track_data = track_data;
      this.id = track_data[0];
      //self.size = track_data[2]
      this.icon = "glyphicon glyphicon-cd";
    }
    if (topDir) {
      this.state = { opened: "true" };
    }
    this.parent = parent; // parent full path
    if (children) {
      this.children = children; // possible both Dir and Track
    }
  }
}

module.exports = class Library {
  constructor() {
    // first time init?
    //this.pathList = getPathList();
    var pathList = [];
    this.jsonTree = this.locationScan([
      `D:\\schubert.dev\\Library_Manager\\Audioก\\MUSIC`,
      `D:\\schubert.dev\\Library_Manager\\Audioก\\sermons`,
    ]);
  }
  libhi() {
    console.log("direct call from renderer to library here");
    //return getPathList();
    return this.db.run("SELECT	1 + 1;");
  }
  async getLibrary() {
    return new Promise((resolve) => {
      resolve(
        this.locationScan([
          `D:\\schubert.dev\\Library_Manager\\Audioก\\MUSIC`,
          `D:\\schubert.dev\\Library_Manager\\Audioก\\sermons`,
        ])
      );
    });
  }
  getTree() {
    console.log("why this not print");
    console.log(this.jsonTree);
    // console.log(this.locationScan([`D:\\test`]));
    let a = this.jsonTree;
    return a;
  }

  // Get stored Locations from database.
  // return array of paths
  async getPathList() {
    //return "this is pathlist";
    // returns a promise
    //var db = this.db;
    async function wrapperFunc() {
      try {
        let arr = [];
        //db.each("SELECT * FROM location", function (err, row) {
        //  console.log("this is a select");
        //  arr.push(row);
        //  console.log(row.loc_id + ": " + row.path + ": " + row.location);
        //});
        // now process r2
        return arr; // this will be the resolved value of the returned promise
      } catch (e) {
        console.log(e);
        throw e; // let caller know the promise was rejected with this reason
      }
    }
    wrapperFunc()
      .then((result) => {
        // got final result
        return result;
      })
      .catch((err) => {
        // got error
        console.error(err);
      });
    // these db calls are too slow...
    this.db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
      console.log(row.id + ": " + row.info);
    });
    //return ;
    this.db.each("SELECT * FROM location", function (err, row) {
      console.log(row);
      //return row;
    });

    let pathList = [];
    this.db.each("SELECT * FROM location", function (err, row) {
      pathList.push(row);
    });
    //return pathList;
  }

  // add to Location list
  // force new scan of ONLY new location
  addLibraryPath(newLine) {
    // add path to file, ALSO update database
    //this.db.run(
    //  `INSERT OR IGNORE INTO location VALUES (null, '${newLine[0]}' )`
    //);
    //conn.commit() // ??
    // scan the new folder
    scanSuccess = libraryDatabaseNew(newLine);
    return scanSuccess;
  }

  // mark all files 'unchecked'
  resetLibrary() {
    // TODO Optimize this
    //this.db.run("UPDATE library SET checked = 0");
    //this.db.run("UPDATE directories SET checked = 0");
    // conn.commit() //??
  }

  libraryDatabaseNew(newPath) {
    // get paths, send to scanner
    // if null or empty check
    if (newPath === undefined || newPath.length === 0) {
      return False;
    }
    // check for files
    // TODO is this right syntax?
    return locationScan([newPath]);
  }

  libraryDatabaseRecheck() {
    // get paths, send to scanner
    // TODO optimize
    // Update pathlist
    // pathList = ["D:\schubert.dev\Library Manager\Audioก\MUSIC\Dee Kheng แคว่แน้ฌี้", "D:\schubert.dev\Library Manager\Audioก\MUSIC\Dee Kheng ทมึลู่งที๊งแว่ลโค๊"]
    pathList = getPathList();
    // if null on startup check
    if (pathList.length === 0) {
      return False;
    }
    // Only check for missing files on app startup.
    // if user deletes files with app open thats THEIR problem
    resetLibrary();
    return locationScan(pathList);
  }

  locationScan(pathList) {
    // Scan the directories
    var fileList = {};
    fileList["root"] = {
      name: "root",
      //text: "root",
      id: "root",
      icon: "glyphicon glyphicon-cd",
      state: { opened: "true" },
      path: "//",
      children: [],
    };

    var getBranch = function (library_path) {
      let a = dirTree(library_path);
      a.state = { opened: "true" };
      return a;
    };

    pathList.forEach((library_path) =>
      fileList["root"].children.push(getBranch(library_path))
    );

    return fileList["root"];
  }

  libraryFileInsert(file) {
    // Update the Database
    // TODO this statement may fail
    this.db.run(
      `INSERT INTO library(name , location , type , size , parent_dir, checked) 
      VALUES ('${file[0]}','${file[1]}','${file[2]}',${file[3]},'${file[4]}',${file[5]})
      ON CONFLICT(name , location) DO UPDATE SET checked=1`
    );
    return True;
  }

  dirInsert(dir) {
    // Update the Database
    this.db.run(
      `INSERT INTO directories(name, parent_dir, location, checked) 
      VALUES ('${dir[0]}','${dir[1]}','${dir[2]}',1)
      ON CONFLICT(name , parent_dir) DO UPDATE SET checked=1`
    );
    return True;
  }

  ////// JSON Tree Stuff /////
  treeBuilder() {
    // Tree Builder Function
    let libTreeDict = {};
    libTreeDict["myRoot"] = libNode(
      "my Library Folders",
      (fullPath = "/"),
      (topDir = 1)
    );
    return libTreeDict;

    // Create a dictionaryObject to procedurally store node objects in
    //let libTreeDict = new Map();

    libTreeDict.set(
      "myRoot",
      libNode("my Library Folders", (fullPath = "/"), (topDir = 1))
    );

    libTreeDict["myRoot"] = libNode(
      "my Library Folders",
      (fullPath = "/"),
      (topDir = 1)
    );
    // Build first layer, user selected library locations
    db.each(`SELECT location FROM location`, function (err, row) {
      // and in the loop use the name as key when you add your instance:
      libTreeDict[row[0]] = libNode(
        path.basename(Path(row[0])),
        (fullPath = row[0]),
        (parent = libTreeDict["myRoot"]),
        (topDir = 1)
      ); // root is parent '/' and locationDir ID is '/path'
    });
    db.each(
      `SELECT name, location, parent_dir, checked FROM directories WHERE checked == 1`,
      function (err, row) {
        // TODO dictionary insert name variable, is it too long?
        libTreeDict[row[1]] = libNode(
          row[0],
          (fullPath = row[1]),
          (parent = libTreeDict[row[2]])
        ); // parent is stored in dir database as '/path'
      }
    );
    // End points, files. Directories or locations are possible parents
    db.each(
      `SELECT name, location, parent_dir, track_id, type, size, checked FROM library WHERE checked == 1`,
      function (err, row) {
        libTreeDict[row[1]] = libNode(
          row[0],
          row[1],
          (parent = libTreeDict[row[2]]),
          (track_data = [row[3], row[0], row[4], row[5]])
        ); // parent is stored in dir database as '/path'
      }
    );
    // returnTree
    // TODO fix returnTree???
    return libTreeDict;
  }
};
