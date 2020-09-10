// Create tables IF NOT EXISTS
// users library history location directories

var dictstring = JSON.stringify(dict);
var fs = require("fs");
fs.writeFile("thing.json", dictstring);
var dict = {
  one: [15, 4.5],
  two: [34, 3.3],
  three: [67, 5.0],
  four: [32, 4.1],
};

let map = new Map();
map.set('key', {'value1', 'value2'});
let values = map.get('key');  

var dictLibStr = JSON.stringify(dictLibrary);
var fs = require("fs");
fs.writeFile("thing.json", dictLibStr);
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
    const library = new libraryLogic();
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

  // access the sql data from renderer
  getter() {
    var db = this.db;
    async function wrapperFunc() {
      try {
        let a = db.run("SELECT	1 + 1;");
        return a;
      } catch (e) {
        console.log(e);
        throw e; // let caller know the promise was rejected with this reason
      }
    }
    return wrapperFunc();
  }
  getData() {
    return this.getter();
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
