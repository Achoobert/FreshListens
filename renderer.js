// renderer.js
//In renderer.js, we have codes for initialization of zerorpc client, and the code for watching the changes in the
//input. Once the user
// JS send the text to Python backend and retrieve the computed result.
/*
If something like dynamic linking errors shows up, try to clean the caches and install the libraries again.

rm -rf node_modules
rm -rf ~/.node-gyp ~/.electron-gyp

npm install
*/

const zerorpc = require("zerorpc");
let client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");

let loadUsers = document.querySelector("#loadUsers");
let getDrives = document.querySelector("#getDrives");
let viewDrives = document.querySelector("#viewDrives");
let submitUser = document.querySelector("#submitUser");
//
let result = document.querySelector("#result");
let newUser = document.querySelector("#newUser");
let users = document.querySelector("#users");
let header = document.querySelector("#header");
let userHistory = document.querySelector("#userHistory");
let sendTracks = document.querySelector("#sendTracks");

// Global selecting variables
var currentUser = 0;
var currentHistory = [];
var toSend = [];
var currentTracks = [];
var selectedDrive = [];

///// debugging stuff, delete later
let echoDiv = document.querySelector("#echoDiv");
let echoButton = document.querySelector("#echoButton");
echoButton.addEventListener("click", () => {
  console.log("click");
  clearEle(echoDiv);
  echoDiv.textContent = "renderer works";
  client.invoke("echo", "api.py -> app.py working", (error, res) => {
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

/////end debug

// Make a single page app
let body = document.querySelector("#body");
let usersView = document.querySelector("#usersView");
let userView = document.querySelector("#userView");
let libraryView = document.querySelector("#libraryView");
let library = document.querySelector("#library");
let toSendView = document.querySelector("#toSendView");
let loadUser = document.querySelector("#loadUser");

sendTracks.addEventListener("click", () => {
  console.log("click");
  clearEle(echoDiv);
  echoDiv.textContent = "renderer works";
  client.invoke("getDrives", (error, res) => {
    if (error) {
      console.error(error);
    } else {
      console.log(res);
      viewDrives.textContent(res);
    }
  });
});
sendTracks.dispatchEvent(new Event("click"));

getDrives.addEventListener("click", () => {
  console.log("click");
  clearEle(echoDiv);
  echoDiv.textContent = "renderer works";
  client.invoke("getDrives", (error, res) => {
    if (error) {
      console.error(error);
      viewDrives.textContent = "drive getting busted";
    } else {
      //console.log(res);
      viewDrives.appendChild(createDriveTable(res));
    }
  });
});
getDrives.dispatchEvent(new Event("click"));

let loadLibrary = document.querySelector("#loadLibrary");
loadLibrary.addEventListener("click", () => {
  console.log("click");
  usersView.style.display = "none";
  userView.style.display = "none";
  libraryView.style.display = "block";

  library.textContent = "  Loading . . .";

  client.invoke("getLibrary", (error, res) => {
    getLibrary();
  });
});

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

loadUsers.addEventListener("click", () => {
  // TODO clear the divs before displaying
  usersView.style.display = "block";
  userView.style.display = "none";
  toSendView.style.display = "none";
  libraryView.style.display = "none";
  //getLibrary();
  getUsers();
});
loadUsers.dispatchEvent(new Event("click"));
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
      library.appendChild(createLibraryTable(res));
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
      } else if (res.length == 0) {
        currentHistory = res;
        userHistory.textContent = "No User History";
      } else {
        console.log(res);
        currentHistory = res;
        //userHistory.textContent = res;
        userHistory.appendChild(createHistoryTable(res));
      }
    }
  });
}
function toSendAdd(data) {
  // add to global object
  toSend.push(data);
  // clear, show, and Update view
  clearEle(toSendView);
  toSendView.style.display = "block";
  toSendView.appendChild(createTable(toSend));
}
function moveSelected() {}
function unMountDrive() {}

/*
  Takes a two dimensional array and returns a formatted html
  has to be .appendChild to the desired div element
  users.appendChild(createTable(res));
  TODO have event listener be a passed variable?
*/
function createLibraryTable(tableData) {
  var table = document.createElement("table");
  var tableBody = document.createElement("tbody");
  tableData.forEach(function (rowData) {
    var row = document.createElement("tr");
    rowData.forEach(function (cellData) {
      // This may cause bug later
      // TODO clever solution
      // filtering out extra location via length. very dumb
      if (cellData != rowData[0] && cellData.length < 60) {
        var cell = document.createElement("td");
        cell.appendChild(document.createTextNode(cellData));
        // Click listener for row
        cell.addEventListener("click", function () {
          // user clicked on row
          toSendAdd(rowData);
          //alert(rowData);
        });
        row.appendChild(cell);
      }
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  return table;
}
function createTable(tableData) {
  var table = document.createElement("table");
  var tableBody = document.createElement("tbody");

  tableData.forEach(function (rowData) {
    var row = document.createElement("tr");
    rowData.forEach(function (cellData) {
      // This may cause bug later
      // TODO clever solution
      // filtering out extra location via length. very dumb
      if (cellData != rowData[0] && cellData.length < 60) {
        var cell = document.createElement("td");
        cell.appendChild(document.createTextNode(cellData));
        // Click listener for row
        cell.addEventListener("click", function (rowData) {
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
function createDriveTable(tableData) {
  var table = document.createElement("table");
  var tableBody = document.createElement("tbody");

  tableData.forEach(function (rowData) {
    var row = document.createElement("tr");
    rowData.forEach(function (cellData) {
      var cell = document.createElement("td");
      cell.appendChild(document.createTextNode(cellData));
      cell.addEventListener("click", function () {
        selectedDrive = rowData;
        alert(rowData);
      });
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  return table;
}
function createUserTable(tableData) {
  var table = document.createElement("table");
  var tableBody = document.createElement("tbody");

  tableData.forEach(function (rowData) {
    var row = document.createElement("tr");
    let rData = rowData;
    rowData.forEach(function (cellData) {
      // This may cause bug later
      // TODO clever solution
      // filtering out extra location via length. very dumb
      var cell = document.createElement("td");
      cell.appendChild(document.createTextNode(cellData));
      // Click listener for row
      cell.addEventListener("click", function () {
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

  tableData.forEach(function (rowData1) {
    var row = document.createElement("tr");
    rowData1.forEach(function (rowData) {
      rowData.forEach(function (cellData) {
        if (cellData != rowData[0]) {
          var cell = document.createElement("td");
          cell.appendChild(document.createTextNode(cellData));
          row.appendChild(cell);
        }
      });
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  return table;
}
function clearEle(elementID) {
  elementID.innerHTML = "";
}

//TODO
function getDrivesFunction() {
  client.invoke("get_drive_info", (error, drive_info) => {
    if (error) {
      console.error(error);
    } else {
      clearEle(driveList);
      if (drive_info == null) {
        driveList.textContent = "null return";
      } else {
        console.log(drive_info);
        driveList = drive_info;
        let string = "";
        res.forEach(function (row) {
          string = string + toString(row) + " <br/>";
        });
        driveList.textContent = "<br/>";
        //driveList.appendChild(createHistoryTable(res));
      }
    }
  });
}
/*
# Test
if __name__ == '__main__':
    drive_info = get_drive_info()
    for drive_letter, drive_type in drive_info:
        print '%s = %s' % (drive_letter, DRIVE_TYPE_MAP[drive_type])
    removable_drives = [drive_letter for drive_letter, drive_type in drive_info if drive_type == DRIVE_REMOVABLE]
    print 'removable_drives = %r' % removable_drives
#C: = DRIVE_FIXED
#D: = DRIVE_FIXED
#E: = DRIVE_CDROM
#F: = DRIVE_REMOVABLE
#removable_drives = ['F:']
*/
