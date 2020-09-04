var dir = require("node-dir");
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
    self.text = text; // what the User sees
    self.name = fullPath; // "d:/root/child" unique 'id'
    if (track_data) {
      // If it is a file
      // [id, name, type, size]
      self.track_data = track_data;
      self.id = track_data[0];
      //self.size = track_data[2]
      self.icon = "glyphicon glyphicon-cd";
    }
    if (topDir) {
      self.state = { opened: "true" };
    }
    self.parent = parent; // parent full path
    if (children) {
      self.children = children; // possible both Dir and Track
    }
  }
}

module.exports = class Library {
  constructor(appDB) {
    this.db = appDB;
    this.db.run("CREATE TABLE IF NOT EXISTS librarylogicworks (info TEXT)");
    // set sql things here

    // first time init?
    if (getPathList() === false) {
      this.jsonTree = {};
    } else {
      // get existing json tree ???
      // TODO this may be incorrect
      this.jsonTree = this.db.run(`SELECT jsonText FROM tree`);
    }
    console.log(this.jsonTree);
  }
  getLibrary() {
    return this.jsonTree;
  }

  // Get stored Locations from database.
  // return array of paths
  getPathList() {
    pathList = [];
    db.each("SELECT * FROM location", function (err, row) {
      pathList.append(row.location);
    });
    return pathList;
  }

  // add to Location list
  // force new scan of ONLY new location
  addLibraryPath(newLine) {
    // add path to file, ALSO update database
    this.db.run(
      `INSERT OR IGNORE INTO location VALUES (null, '${newLine[0]}' )`
    );
    //conn.commit() // ??
    // scan the new folder
    scanSuccess = libraryDatabaseNew(newLine);
    return scanSuccess;
  }

  // mark all files 'unchecked'
  resetLibrary() {
    // TODO Optimize this
    this.db.run("UPDATE library SET checked = 0");
    this.db.run("UPDATE directories SET checked = 0");
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
    files = [];
    // r=root, d=directories, f = files
    // make an array of ID's not found, remove them
    for (library_path in pathList) {
      // library_path
      dir.files(library_path, function (err, files) {
        if (err) throw err;
        console.log(files);
        // we have an array of files now, so now we'll iterate that array
        files.forEach(function (filepath) {
          // track_id,name , location , type , size , parent_dir, checked
          libraryFileInsert([
            path.basename(filepath), // Name('song.mp3')
            filepath, // location ('d:/myLibrary/audio/song.mp3')
            "audio", // Type
            fs.stat(filepath).size, // Parent Dir ('d:/myLibrary/audio')
            path.dirname(filepath), // parent root ('d:/myLibrary')
            1, // isChecked
          ]);
        });
      });
      dir.subdirs(library_path, function (err, subdirs) {
        if (err) throw err;
        console.log(subdirs);
        //we have an array of subdirs now, so now we'll iterate that array
        subdirs.forEach(function (subDirPath) {
          // name, parent_dir, location
          dirInsert([
            path.basename(subDirPath), // name ('songs')
            path.dirname(subDirPath), // parent_dir ('d:/myLibrary/audio')
            library_path, // rootLoc d:/myLibrary/audio/songs
          ]);
        });
      });
    }
    return True;
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

    // Create a dictionaryObject to procedurally store node objects in
    libTreeDict = {};

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
