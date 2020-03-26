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
let header = document.querySelector("#header");
let userHistory = document.querySelector("#userHistory");

// Global selecting variables
var currentUser = 0;
var currentHistory = [];
var currentTracks = [];

///// debugging stuff, delete later
let echoDiv = document.querySelector("#echoDiv");
let echoButton = document.querySelector("#echoButton");
echoButton.addEventListener("click", () => {
  console.log("click");
  clearEle(echoDiv);
  echoDiv.textContent = "renderer works";
  client.invoke("echo", "api.py working", (error, res) => {
    if (error) {
      console.error(error);
      echoDiv.textContent = "api.py busted";
    } else {
      //clearEle(users);
      console.log(res);
      echoDiv.textContent = res;
    }
  });
});
echoButton.dispatchEvent(new Event("click"));

/////

// Make a single page app
let body = document.querySelector("#body");
let usersView = document.querySelector("#usersView");
let userView = document.querySelector("#userView");
let libraryView = document.querySelector("#libraryView");
let loadUser = document.querySelector("#loadUser");
loadUser.addEventListener("click", () => {
  // Clear
  client.invoke("testInsert", 1, 4, (error, res) => {
    if (error) {
      console.error(error);
    } else {
      //clearEle(users);
      console.log(res);
    }
  });
  usersView.style.display = "none";
});
//loadUser.dispatchEvent(new Event("click"));

load.addEventListener("click", () => {
  // TODO clear the divs before displaying
  usersView.style.display = "block";
  userView.style.display = "none";
  libraryView.style.display = "none";
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
      clearEle(users);
      users.appendChild(createUserTable(res));
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
      // update the user list
      getUsers();
      console.log(res);
    }
  });
}
function showUser(userData) {
  // update view
  usersView.style.display = "none";
  userView.style.display = "block";
  header.textContent = userData[1];
  // get user's history
  displayHistory(userData[0]);
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

function displayHistory(userId) {
  client.invoke("getHistory", userId, (error, res) => {
    if (error) {
      console.error(error);
    } else {
      clearEle(userHistory);
      if (res == null) {
        userHistory.textContent = "null return";
      } else {
        console.log(res);
        currentHistory = res;
        //userHistory.textContent = res;
        userHistory.appendChild(createHistoryTable(res));
      }
    }
  });
}
function moveSelected() {}
function unMountDrive() {}

/*
  Takes a two dimensional array and returns a formatted html
  has to be .appendChild to the desired div element
  users.appendChild(createTable(res));
  TODO have event listener be a passed variable?
*/
function createTable(tableData, onClickFunc) {
  var table = document.createElement("table");
  var tableBody = document.createElement("tbody");
  if (onClickFunc == undefined) {
    onClickFunc = function(rowData) {
      // alert data ID
      alert(rowData[0]);
    };
  }

  tableData.forEach(function(rowData) {
    var row = document.createElement("tr");
    rowData.forEach(function(cellData) {
      // This may cause bug later
      // TODO clever solution
      // filtering out extra location via length. very dumb
      if (cellData != rowData[0] && cellData.length < 60) {
        var cell = document.createElement("td");
        cell.appendChild(document.createTextNode(cellData));
        // Click listener for row
        cell.addEventListener("click", function(rowData) {
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
function createUserTable(tableData) {
  var table = document.createElement("table");
  var tableBody = document.createElement("tbody");

  tableData.forEach(function(rowData) {
    var row = document.createElement("tr");
    let rData = rowData;
    rowData.forEach(function(cellData) {
      // This may cause bug later
      // TODO clever solution
      // filtering out extra location via length. very dumb
      var cell = document.createElement("td");
      cell.appendChild(document.createTextNode(cellData));
      // Click listener for row
      cell.addEventListener("click", function(rowData) {
        // alert data ID
        currentUser = rData;
        showUser(rData);
      });
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  return table;
}
function createHistoryTable(tableData) {
  var table = document.createElement("table");
  var tableBody = document.createElement("tbody");

  tableData.forEach(function(rowData) {
    var row = document.createElement("tr");
    rowData.forEach(function(cellData) {
      //if (cellData. != rowData[0]) {
      var cell = document.createElement("td");
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
      //}
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  return table;
}
function clearEle(elementID) {
  elementID.innerHTML = "";
}
