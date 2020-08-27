const { remote } = require("electron");

// const Square = require('./square.js');
// const mySquare = new Square(2);
// console.log(`The area of mySquare is ${mySquare.area()}`);
const appLogic = remote.require("./appLogic.js");
const client = new appLogic(2);
console.log(`an app variable is ${client.history()}`);
// this setup ONLY allows access to module exports class

// ~~~~~~~is remote working~~~~~~~~~~~
console.log(client.hi());
console.log(client.echo("Bounce me back"));
console.log(client.testCaller("renderer here, "));
// ~~~~~~~~end is remote working~~~~~~~~~~~~

// send data, get no confirmation back
client.echo("fancy call test");

// get data
console.log(`an app variable is ${client.history()}`);

// Global variables
// view variables
// Cashing the library html element
var libraryObj;
var libraryLatest = 0;

/**
 * @function asyncCallLibrary
 *  get the the library JSON object
 *  but check if already local
 * @update libraryObj
 * @return promise resolve {htmlObject}
 */
async function asyncCallLibrary() {
  return new Promise((resolve) => {
    if (libraryLatest == 0) {
      getLibrary().then((result) => {
        libraryObj = result;
        resolve(result);
      });
    } else {
      libraryLatest = 1;
      resolve(libraryObj);
    }
  });
}
/**
 * @function asyncUpdateLibrary
 *  update the library
 * @update libraryObj
 * @return promise resolve {htmlObject}
 */
async function asyncUpdateLibrary(path) {
  // only run this if new paths have been added
  return new Promise((resolve) => {
    libraryDatabaseRecheck(path).then(() => {
      getLibrary().then((result) => {
        libraryObj = result;
        //console.log(result);
        resolve(result);
      });
    });
  });
}
/**
 * @function asyncCheckLibrary
 *  update the library
 * @update libraryObj
 * @return promise resolve {htmlObject}
 */
async function asyncCheckLibrary() {
  // only run this if user tells up to
  return new Promise((resolve) => {
    libraryDatabaseRecheck().then(() => {
      // library data might be old
      libraryLatest = 0;
      asyncCallLibrary().then((result) => {
        resolve(result);
      });
    });
  });
}

let echoButton = document.querySelector("#echoButton");

echoButton.addEventListener("click", () => {
  let dataFromServer = client.echo("echoing with boring call", (error, res) => {
    //
    if (error) {
      console.log("this is an error");
      console.error(error);
    } else {
      console.log("erijri");
      return res;
    }
  });
});
echoButton.dispatchEvent(new Event("click"));
///// end debug

/**
 * @function libraryDatabaseRecheck
 *  Tell python to re-scan all library directories
 * @update SQLite library
 */
function libraryDatabaseRecheck() {
  return new Promise((resolve) => {
    let res = client.libraryDatabaseRecheck((error, res) => {});
    console.log("Library checked " + res);
    libraryLatest = 1;
    resolve(1);
  });
}

sendFiles.addEventListener("click", () => {
  console.log([toSend, currentUser[0], selectedDrive[0]]);
  let result = client.sendFiles(
    [toSend, currentUser[0], selectedDrive[0]],
    (error, result) => {
      if (error) {
        // where tf?
        console.error(error);
      } else {
        return result;
      }
    }
  );
  console.log(result);
});
