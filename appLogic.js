function internalF(inputVar) {
  return [inputVar, "yo"];
}

const userLogic = require("./classes/userLogic.js");
const libraryLogic = require("./classes/libraryLogic.js");

module.exports = class Client {
  constructor() {
    // big question,
    // is it possible to import sqllite in two files?
    const user = new userLogic();
    this.user = user;
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
