// renderer.js
//In renderer.js, we have codes for initialization of zerorpc client, and the code for watching the changes in the
//input. Once the user
// JS send the text to Python backend and retrieve the computed result.

const zerorpc = require("zerorpc");
let client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");
debugger;
let load = document.querySelector("#load");
let submitUser = document.querySelector("#submitUser");
//
let result = document.querySelector("#result");
let newUser = document.querySelector("#newUser");
let library = document.querySelector("#library");
let users = document.querySelector("#users");

load.addEventListener("click", () => {
  // TODO clear the divs before displaying
  getLibrary();
  getUsers();
});
load.dispatchEvent(new Event("click"));
//
submitUser.addEventListener("click", () => {
  console.log("clicked");
  console.log(newUser.location.value, newUser.userName.value);
  addUser([newUser.userName.value, newUser.location.value]);
});
//submitUser.dispatchEvent(new Event("click"));

//display, select-> display-display, select multiple->execute,
function getUsers() {
  client.invoke("getUsers", (error, res) => {
    if (error) {
      console.error(error);
    } else {
      console.log(res);
      clearEle(users);
      users.appendChild(createTable(res));
    }
  });
}
function addUser(data) {
  console.log(data);
  client.invoke("newUser", newUser.value, (error, res) => {
    if (error) {
      console.error(error);
    } else {
      console.log(res);
      result.textContent = res;
    }
  });
}
function getLibrary() {
  client.invoke("getLibrary", (error, res) => {
    if (error) {
      console.error(error);
    } else {
      clearEle(library);
      library.appendChild(createTable(res));
    }
  });
}

function displayHistory() {}
function moveSelected() {}
function unMountDrive() {}

/*
  Takes a two dimensional array and returns a formatted html
  has to be .appendChild to the desired div element
  users.appendChild(createTable(res));
  TODO have event listener be a passed variable?
*/
function createTable(tableData) {
  var table = document.createElement("table");
  var tableBody = document.createElement("tbody");

  tableData.forEach(function(rowData) {
    var row = document.createElement("tr");
    rowData.forEach(function(cellData) {
      // This may cause bug later
      // filtering out extra location via length. very dumb
      if (cellData != rowData[0] && cellData.length < 60) {
        var cell = document.createElement("td");
        cell.appendChild(document.createTextNode(cellData));
        // Click listener for row
        cell.addEventListener("click", function() {
          // alert data ID
          alert(rowData[0]);
        });
        row.appendChild(cell);
      }
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  return table;
}
function clearEle(elementID) {
  elementID.innerHTML = "";
}
