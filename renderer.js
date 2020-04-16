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
//let addUser = document.querySelector("#addUser");
let users = document.querySelector("#users");
let header = document.querySelector("#header");
let userHistory = document.querySelector("#userHistory");
let sendFiles = document.querySelector("#sendFiles");
let todo = document.querySelector("#todo");
let selected = document.querySelector("#selected");

// Global selecting variables
// TODO check, lets try cashing the library html element
var libraryObj;
async function asyncCallLibrary() {
  if (libraryObj == undefined || libraryObj == null) {
    console.log("calling");
    const result = await getLibrary();
    //const result = await resolveAfter2Seconds();
    //console.log(result);
    libraryObj = result;
    return result;
  } else {
    return libraryObj;
  }
}

//asyncCallLibrary();

var fileTypesSend = [];
var totalSendSize = 0;
var currentUser = [1, "John", "city"];
var currentHistory = [];
// currently selected tracks to send to drive
var toSend = [
  [[1], ["11โต๋  - ขอบพระคุณ"], ["audio"], [3899303]],
  [[22], ["argerr"], ["audio"], [38903]],
  [[43], ["songg"], ["audio"], [99303]],
];
// selected drive
var selectedDrive = ["D:", "ThumbDrive"];

// display selected user and drive
function updateSelected() {
  selected.textContent = currentUser[1] + "  " + selectedDrive[0];
}

///// debugging stuff, delete later
let echoDiv = document.querySelector("#echoDiv");
let echoButton = document.querySelector("#echoButton");
echoDiv.style.display = "none";
echoButton.style.display = "none";
echoButton.addEventListener("click", () => {
  console.log("click");
  clearEle(echoDiv);
  echoDiv.textContent = "renderer works";
  client.invoke("echo", "api.py -> app.py working", (error, res) => {
    echoDiv.style.display = "block";
    echoButton.style.display = "block";
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
//echoButton.dispatchEvent(new Event("click"));
///// end debug

// Make a single page app
let body = document.querySelector("#body");
let usersView = document.querySelector("#usersView");
let userView = document.querySelector("#userView");
let libraryView = document.querySelector("#libraryView");
let library = document.querySelector("#library");
let toSendView = document.querySelector("#toSendView");

sendFiles.addEventListener("click", () => {
  //console.log([toSend, currentUser[0], selectedDrive[0]]);
  client.invoke(
    "sendFiles",
    [toSend, currentUser, selectedDrive[0]],
    (error, res) => {
      if (error) {
        console.error(error);
      } else {
        console.log(res);
        //viewDrives.textContent(res);
      }
    }
  );
});
//sendFiles.dispatchEvent(new Event("click"));
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
  toSendViewRender();
  //client.invoke("getLibrary", (error, res) => {
  //  getLibrary();
  //});
});
loadLibrary.dispatchEvent(new Event("click"));
loadUsers.addEventListener("click", () => {
  // TODO clear the divs before displaying
  usersView.style.display = "block";
  userView.style.display = "none";
  toSendView.style.display = "none";
  todo.style.display = "none";
  libraryView.style.display = "block";
  //toSendViewRender();
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
  client.invoke("addUser", addUser.value, (error, res) => {
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
  console.log(userData);
  // get user's history
  displayHistory(userData[0]);
}
function getLibrary() {
  return new Promise((resolve) => {
    setTimeout(() => {
      client.invoke("getLibrary", (error, res) => {
        if (error) {
          console.error(error);
        } else {
          resolve(createLibraryTable(res));
        }
      });
      //resolve("resolved");
    }, 2000);
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
        //console.log(res);
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
  //console.log(toSend);
  totalSendSize = data[3] + totalSendSize;
  if (fileTypesSend.includes(data[2])) {
    fileTypesSend.append(data[2]);
  }
  toSendViewRender();
}
function toSendReorder(data) {
  // modify global object???
  //toSend reorder as data
  // TODO
  toSendViewRender();
}
// clear, show, and Update view
function toSendViewRender() {
  clearEle(toSendView);
  toSendView.style.display = "block";
  //toSendView.textContent = "Total size to send is " + toString(totalSendSize);
  //console.log(getLibrary());
  Promise.all([
    (async () =>
      toSendView.appendChild(
        sideBySide([await asyncCallLibrary(), createSendTable(toSend)])
      ))(),
    (async () =>
      console.log(await asyncCallLibrary(), createSendTable(toSend)))(),
  ]);
  //toSendView.appendChild(sideBySide([libraryObj, createSendTable(toSend)]));
}
function resolveAfter2Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 2000);
  });
}

/*
 * take in an array of table,
 * return them next to each other in a row
 * //<div class="container">
 * //<div class="row"></div>
 */
function sideBySide(tables) {
  //<div class="container">
  //<div class="row"></div>
  //if (tables.isArray) {
  let container = document.createElement("container");
  container.setAttribute("class", "container");
  let row = document.createElement("row");
  row.setAttribute("class", "row");
  tables.forEach(function (table) {
    console.log(tables);
    row.appendChild(table);
  });
  container.appendChild(row);
  return container;
  //}
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
  // formatting box
  var table = document.createElement("table");
  var tableBody = document.createElement("tbody");
  var outerBox = document.createElement("outerBox");
  outerBox.setAttribute("class", "col-lg-12");
  // table formatting
  var table = document.createElement("table");
  table.setAttribute("class", "table table-hover");
  table.setAttribute("id", "myTable");
  // make a non-sortable tableHead and attach it to the table
  function createHeader() {
    var tableHead = document.createElement("thead");
    let row = document.createElement("tr");
    // tried to slim this down to a single cell. TODO may need to make cell class?
    let cell0 = document.createElement("th");
    let cell1 = document.createElement("th");
    let cell2 = document.createElement("th");
    function insert(cell) {
      row.appendChild(cell);
    }

    cell0.innerHTML = "File Name";
    insert(cell0);
    cell1.innerHTML = "Type";
    insert(cell1);
    cell2.innerHTML = "Size";
    insert(cell2);

    tableHead.appendChild(row);
    table.appendChild(tableHead);
  }
  createHeader();
  //old

  tableData.forEach(function (rowData) {
    var row = document.createElement("tr");
    rowData.forEach(function (cellData) {
      if (cellData != rowData[0]) {
        var cell = document.createElement("td");
        cell.appendChild(document.createTextNode(cellData));
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
  outerBox.appendChild(table);
  return outerBox;
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
      //if (cellData != rowData[3]) {
      var cell = document.createElement("td");
      cell.appendChild(document.createTextNode(cellData));
      // Click listener for row
      cell.addEventListener("click", function (rowData) {
        // alert data ID
        alert(rowData[0]);
      });
      row.appendChild(cell);
      //}
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  return table;
}
function createSendTable(tableData) {
  // formatting box
  var outerBox = document.createElement("outerBox");
  outerBox.setAttribute("class", "col-lg-12");
  // table formatting
  var table = document.createElement("table");
  table.setAttribute("class", "table table-hover");
  table.setAttribute("id", "myTable");
  // make a non-sortable tableHead and attach it to the table
  function createHeader() {
    var tableHead = document.createElement("thead");
    let row = document.createElement("tr");
    // tried to slim this down to a single cell. TODO may need to make cell class?
    let cell0 = document.createElement("th");
    let cell1 = document.createElement("th");
    let cell2 = document.createElement("th");
    function insert(cell) {
      row.appendChild(cell);
    }

    cell0.innerHTML = "#";
    insert(cell0);
    cell1.innerHTML = "File Name";
    insert(cell1);
    cell2.innerHTML = "Type";
    insert(cell2);

    tableHead.appendChild(row);
    table.appendChild(tableHead);
  }
  createHeader();
  var tableBody = document.createElement("tbody");
  tableBody.setAttribute("class", "ui-sortable");
  //create body
  tableData.forEach(function (rowData) {
    let row = document.createElement("tr");
    rowData.forEach(function (cellData) {
      //TODO  force vertical??

      if (cellData != rowData[3]) {
        var cell = document.createElement("td");
        cell.appendChild(document.createTextNode(cellData));
        // give it tag for tracking ID after drag
        var input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", "fileID");
        input.setAttribute("value", rowData);
        //append to form element that you want .
        row.appendChild(input);
        row.setAttribute("id", rowData[0]);
        row.setAttribute("class", "ui-sortable-handle");
        row.appendChild(cell);
      }
      tableBody.appendChild(row);
    });
  });
  table.appendChild(tableBody);
  outerBox.appendChild(table);
  return outerBox;
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
        updateSelected();
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
        updateSelected();
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
#
#   Methods for administrating table order
#
*/
$(function () {
  $("#sortable").sortable();
  $("#sortable").disableSelection();
});
var fixHelperModified = function (e, tr) {
    var $originals = tr.children();
    var $helper = tr.clone();
    $helper.children().each(function (index) {
      $(this).width($originals.eq(index).width());
    });
    return $helper;
  },
  updateIndex = function (e, ui) {
    alert("hi");
    console.log(e);
    $("td.index", ui.item.parent()).each(function (i) {
      $(this).html(i + 1);
    });
    $("input[type=text]", ui.item.parent()).each(function (i) {
      $(this).val(i + 1);
    });
  };

$("#myTable tbody")
  .sortable({
    helper: fixHelperModified,
    stop: function (e, ui) {
      $("td.index", ui.item.parent()).each(function (i) {
        $(this).html(i + 1);
      });
      $("input[type=text]", ui.item.parent()).each(function (i) {
        $(this).val(i + 1);
      });
      console.log($("#myTable tbody").sortable("toArray"));
      toSend = $("#myTable tbody").sortable("toArray");
    },
  })
  .disableSelection();
