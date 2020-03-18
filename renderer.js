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
let helloWorld = document.querySelector("#helloWorld");
let users = document.querySelector("#users");

load.addEventListener("click", () => {
  getLibrary();
  getUsers();
});
load.dispatchEvent(new Event("click"));
//
submitUser.addEventListener("button", () => {
  console.log("clicked");
  let data = [1, 2];
  addUser(data);
});
submitUser.dispatchEvent(new Event("click"));

//display, select-> display-display, select multiple->execute,
function getUsers() {
  client.invoke("getUsers", (error, res) => {
    if (error) {
      console.error(error);
    } else {
      console.log(res);
      users.appendChild(createTable(res));
    }
  });
}
function addUser(data) {
  console.log(data);
  /*client.invoke("newUser", newUser.value, (error, res) => {
    if (error) {
      console.error(error);
    } else {
      result.textContent = res;
    }
  });*/
}
function getLibrary() {
  client.invoke("getLibrary", (error, res) => {
    if (error) {
      console.error(error);
    } else {
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
      var cell = document.createElement("td");
      cell.appendChild(document.createTextNode(cellData));
      // Click listener for row
      cell.addEventListener("click", function() {
        // alert data ID
        alert(rowData[0]);
      });
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  return table;
}
