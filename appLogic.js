// Create tables IF NOT EXISTS
// users library history location directories
const os = require("os");
const storage = require("electron-json-storage");

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// Summary: Get the default data path
// Returns: String - default data path
const defaultDataPath = storage.getDefaultDataPath();

// The default value will be used if the directory is undefined.
// Summary: Set current data path
storage.setDataPath(os.tmpdir());

// Returns the current data path. It defaults to a directory called "storage"
// inside Electron's userData path.
// Kind: static method of storage
// Summary: Get current user data path
// Returns: String - the user data path
const dataPath = storage.getDataPath();
console.log(dataPath);

// Kind: static method of storage
// Summary: Read user data
//const storage = require("electron-json-storage");

storage.get("foobar", function (error, data) {
  if (error) throw error;

  console.log(data);
});

// This function returns an object with the data of all the passed keys.
// If one of the keys doesn't exist, an empty object is returned for it.
// Kind: static method of storage
// Summary: Read many user data keys
//const storage = require("electron-json-storage");

storage.getMany(["foobar", "barbaz"], function (error, data) {
  if (error) throw error;

  console.log(data.foobar);
  console.log(data.barbaz);
});
// storage.getAll([options], callback)
// This function returns an empty object if there is no data to be read.
//const storage = require("electron-json-storage");

storage.getAll(function (error, data) {
  if (error) throw error;

  console.log(data);
});

// storage.set(key, json, [options], callback)
// Kind: static method of storage
// Summary: Write user data
//const storage = require("electron-json-storage");

storage.set("foobar", { foo: "bar" }, function (error) {
  if (error) throw error;
  //console.log(`Adding ${foo} to bar`);
});

// storage.has(key, [options], callback)
// Kind: static method of storage
// Summary: Check if a key exists
//const storage = require("electron-json-storage");

storage.has("foobar", function (error, hasKey) {
  if (error) throw error;

  if (hasKey) {
    console.log("There is data stored as `foobar`");
  }
});

storage.has("foobar1337", function (error, hasKey) {
  if (error) throw error;

  if (hasKey) {
    console.log("There is nodata stored as `foobar1337`");
  }
});

// storage.keys([options], callback)
// Kind: static method of storage
// Summary: Get the list of saved keys
//const storage = require("electron-json-storage");

storage.keys(function (error, keys) {
  if (error) throw error;

  for (var key of keys) {
    console.log("There is a key called: " + key);
  }
});

//storage.remove(key, [options], callback)
//Notice this function does nothing, nor throws any error if the key doesn't exist.
//Summary: Remove a key
//const storage = require("electron-json-storage");

storage.remove("foobar1", function (error) {
  if (error) throw error;
});

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

var dict = {
  one: [15, 4.5],
  two: [34, 3.3],
  three: [67, 5.0],
  four: [32, 4.1],
};
var dictstring = JSON.stringify(dict);
var fs = require("fs");
//fs.writeFile("thing.json", dictstring);

let map = new Map();
map.set("key", { value1: "value2" });
let values = map.get("key");

var dictLibStr = JSON.stringify(dictLibrary);
var fs = require("fs");
//fs.writeFile("thing.json", dictLibStr);
var dictLibrary = {
  one: [15, 4.5],
  two: [34, 3.3],
  three: [67, 5.0],
  four: [32, 4.1],
};

class BaseClass {
  constructor(id, name, location) {
    this.id = id;
    this.name = name;
    this.location = location;
  }
}

class User extends BaseClass {}
class Library extends BaseClass {
  constructor(type, size, parent_dir, checked) {
    this.type = type;
    this.size = size;
    this.parent_dir = parent_dir;
    this.checked = checked;
    //UNIQUE(name, location);
  }
}
/*
db.run(
  "CREATE TABLE IF NOT EXISTS history(history_id  INTEGER PRIMARY KEY, date text, user_id INTERGER, track_id INTERGER, FOREIGN KEY (user_id) REFERENCES users (user_id), FOREIGN KEY (track_id) REFERENCES library (track_id))"
);
db.run(
  "CREATE TABLE IF NOT EXISTS location(loc_id INTEGER PRIMARY KEY, location text, path text )"
);
db.run(
  "CREATE TABLE IF NOT EXISTS directories (dir_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, parent_dir TEXT, location TEXT, checked INTEGER DEFAULT 0, UNIQUE(name, location))"
);
*/
function internalF(inputVar) {
  return [inputVar, "yo"];
}

const userLogic = require("./source/classes/userLogic.js");
const libraryLogic = require("./source/classes/libraryLogic.js");

module.exports = class Client {
  constructor() {
    //const user = new userLogic();
    //this.user = user;
    //user.test();
    //
    const library = new libraryLogic(storage);
    this.library = library;
    this.jsonTree = library.jsonTree;
  }

  // get data
  hi() {
    console.log("Where does this come out");
    return "hi";
  }

  // get data, from a further internal function
  testCaller(inputVar) {
    return internalF(inputVar);
  }

  // get data based on existing cursor
  history() {
    return [[this.userID], 2, 3, 4, 5];
  }

  // do something with data send in
  storeData(data) {
    fff;
  }

  // get a function
  echo = echo;

  /**
   * @method objectByID()
   * return the specific object requested by the provided id.
   * @param {string} ID
   * @return {obj}
   */
  objectByID(ID) {
    return this.objects((o) => {
      return o.id == ID || o.name == ID || o.label == ID;
    })[0];
  }

  /**
   * @method queries()
   *
   * return an array of all the ABObjectQueries for this ABApplication.
   *
   * @param {fn} filter  	a filter fn to return a set of ABObjectQueries that
   *						this fn returns true for.
   * @return {array} 	array of ABObjectQueries
   */
  queries(filter) {
    filter =
      filter ||
      function () {
        return true;
      };

    return (this._queries || []).filter(filter);
  }
};

//

function echo(text) {
  // """send any text to get echoed"""
  console.log("Echoing", text);
  return text + " .. version";
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

exports.appInit = () => {
  //
  try {
    console.log(checkDatabase());
    console.log(resetLibrary());
  } catch (err) {
    return err.message;
  }
};
exports.libraryDatabaseRecheck = () => {
  // library Database Rechecker
  // TODO a try
  try {
    return libraryDatabaseRecheck();
  } catch (err) {
    return err.message;
  }
};

exports.libraryDatabaseNew = (newPath) => {
  // """library Database new updater"""
  try {
    return libraryDatabaseNew(newPath);
  } catch (err) {
    return err.message;
  }
};

exports.addUser = (userData) => {
  // """based on the input text, return the int result"""
  try {
    return addUser(userData);
  } catch (err) {
    return err.message;
  }
};
exports.addLibraryPath = (newPath) => {
  // """Return list of drives"""
  try {
    return addLibraryPath(newPath);
  } catch (err) {
    return err.message;
  }
};

exports.getUsers = () => {
  //"""based on the input text, return the int result"""
  try {
    return getUsers();
  } catch (err) {
    return err.message;
  }
};
exports.getHistory = (userID) => {
  // """based on the input text, return the int result"""
  // #return [1]
  try {
    return getHistory(userID);
  } catch (err) {
    return err.message;
  }
};
exports.getDrives = () => {
  // """based on the input text, return the int result"""
  try {
    return getDrives();
  } catch (err) {
    return err.message;
  }
};
exports.getLibrary = () => {
  // """based on the input text, return the int result"""
  try {
    return getLibrary();
  } catch (err) {
    return err.message;
  }
};
exports.getPathList = (self) => {
  // """Return list of sources"""
  try {
    return getPathList();
  } catch (err) {
    return err.message;
  }
};

exports.sendFiles = (dataArr) => {
  // """based on the input text, return the int result"""
  try {
    // # toSend, currentUser, selectedDrive
    return sendFiles(dataArr);
  } catch (err) {
    return err.message;
  }
};
