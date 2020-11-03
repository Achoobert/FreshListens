const dirTree = require("directory-tree");
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
  constructor(storage) {
    // Check if first time init
    // booleans
    this.storage = storage;
    this.libSet = storage.has("location", function (error, hasKey) {
      if (error) throw error;

      if (hasKey) {
        console.log("There is data stored as `location`");
        return true;
      } else {
        return false;
      }
    });

    // Get libraryTree
    this.jsonTree = storage.get("library", function (error, data) {
      if (error) throw error;

      console.log(data);
      return data;
    });

    //this.pathList = getPathList();
    this.pathList = storage.get("location", function (error, data) {
      if (error) throw error;
      console.log(data);
      return data;
    });
    this.addLibraryPath(`D:\\schubert.dev\\Library_Manager\\Audioก\\MUSIC`);
    this.addLibraryPath(`D:\\schubert.dev\\Library_Manager\\Audioก\\sermons`);
  }
  libhi() {
    console.log("direct call from renderer to library here");
    //return getPathList();
    return "SELECT	1 + 1;";
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
    if (newLine === undefined || newLine.length === 0) {
      return False;
    }
    // scan the new folder
    // check for files
    scanSuccess = this.locationScan([newLine]);

    // add to local storage
    this.storage.set("location", { newLine }, function (error) {
      if (error) throw error;
      console.log(`Adding ${newLine} to location list`);
    });

    return scanSuccess;
  }

  // mark all files 'unchecked'
  resetLibrary() {
    // TODO Optimize this
    //this.db.run("UPDATE library SET checked = 0");
    //this.db.run("UPDATE directories SET checked = 0");
    // conn.commit() //??
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

  jsonTreeInit() {
    //check if exist
    let libInit = this.storage.has("library", function (error, hasKey) {
      if (error) throw error;
      return hasKey;
    });
    // if does not exist, insert root node
    if (!libInit) {
      let fileList = new Map();
      fileList["root"] = {
        name: "root",
        //text: "root",
        id: "root",
        icon: "glyphicon glyphicon-cd",
        state: { opened: "true" },
        path: "//",
        children: [],
      };
      this.storage.set("library", { fileList }, function (error) {
        if (error) throw error;
        console.log(`Adding ${fileList} to library`);
      });
    }

    // return the whole library
    return this.storage.get("library", function (error, data) {
      if (error) throw error;
      console.log(data.fileList);
      return data.fileList;
    });
  }

  // Makes a new 'branch' of the library for each location.
  locationScan(pathList) {
    // get stored root + any stored json
    // TODO need to wait on this to complete before continuing
    var fileList = this.jsonTreeInit();

    // Scan a directory
    var getBranch = function (library_path) {
      let a = dirTree(library_path);
      a.state = { opened: "true" };
      return a;
    };
    // input: array of paths,
    // output: save each branch to fileList json
    console.log(fileList.root);
    pathList.forEach((library_path) =>
      fileList.root.children.push(getBranch(library_path))
    );

    // Push the newly updated tree to long-term storage
    this.storage.set("library", { fileList }, function (error) {
      if (error) throw error;
      console.log(`Adding ${fileList} to lib`);
    });
    // update our local variable...
    this.jsonTree = fileList["root"];
    // return the whole thing just in case
    return fileList["root"];
  }
};
