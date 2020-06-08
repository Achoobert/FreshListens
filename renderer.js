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
/////const jstree = require("./node_modules/jstree/dist/jstree.min.js");
//let jstree = new jstree.Client();

let loadUsers = document.querySelector("#loadUsers");
let getDrives = document.querySelector("#getDrives");
let viewDrives = document.querySelector("#viewDrives");
let submitUser = document.querySelector("#submitUser");
let users = document.querySelector("#users");
let userHistory = document.querySelector("#userHistory");
let sendFiles = document.querySelector("#sendFiles");
let todo = document.querySelector("#todo");
let selected = document.querySelector("#selected");
let toSendSize = document.querySelector("#toSendSize");
let pickLibraryLocation = document.querySelector("#pickLibraryLocation");

// Global variables
// view variables
// Cashing the library html element
var libraryObj;

/**
 * @function asyncCallLibrary
 *  update/ init the library element
 * @update libraryObj
 * @return promise resolve {htmlObject}
 */
async function asyncCallLibrary() {
  // only run this if new paths have been added
  return new Promise((resolve) => {
    getLibrary().then((result) => {
      libraryObj = result;
      resolve(result);
    });
  });
}

// user selection variables
// If use push, important to initialize
var currentUser = [1, "John", "city"];
var currentHistory = [];
// currently selected tracks to send to drive
var toSend = [
  [1, "11โต๋  - ขอบพระคุณ", "audio", 3899303],
  [22, "argerr", "audio", 38903],
  [43, "songg", "audio", 99303],
];
var fileTypesSend = [];
var totalSendSize = 0;
/**
 * @function bytesConvert
 *  convert bytes number to appropriate unit
 * @return string "# xB"
 */
function bytesConvert(bytes) {
  if (bytes >= 1073741824) {
    bytes = (bytes / 1073741824).toFixed(2) + " GB";
  } else if (bytes >= 1048576) {
    bytes = (bytes / 1048576).toFixed(2) + " MB";
  } else if (bytes >= 1024) {
    bytes = (bytes / 1024).toFixed(2) + " KB";
  } else if (bytes > 1) {
    bytes = bytes + " bytes";
  } else if (bytes == 1) {
    bytes = bytes + " byte";
  } else {
    bytes = "0 bytes";
  }
  return bytes;
}
// selected drive
var selectedDrive = ["D:", "ThumbDrive"];

/**
 * @function updateSelected
 *  display selected user and drive
 * @update DOM : selected.textContent
 */
function updateSelected() {
  selected.textContent =
    "user: " +
    currentUser[1] +
    "  Drive: " +
    selectedDrive[0] +
    "  Total send size: " +
    bytesConvert(totalSendSize) +
    "  " +
    fileTypesSend;
}

///// debugging stuff, delete later
let echoButton = document.querySelector("#echoButton");

echoButton.addEventListener("click", () => {
  //libraryDatabaseInit();
  // console.log($("#testTree").jstree(true).get_node("Child node 23"));
  //$("#testTree").jstree(false).select_node("Child node 1");
  client.invoke("echo", "api.py -> app.py working", (error, res) => {
    echoButton.style.display = "block";
    if (error) {
      console.error(error);
    } else {
      echoButton.style.display = "none";
      console.log(res);
    }
    toSendViewRender();
    toSendView.style.display = "none";
    //$().radio('dispose')
  });
});

echoButton.dispatchEvent(new Event("click"));
///// end debug

// Make a single page app
let usersView = document.querySelector("#usersView");
let userView = document.querySelector("#userView");
let toSendView = document.querySelector("#toSendView");
let newUserData = document.querySelector("#newUserData");

/**
 * @function libraryDatabaseInit
 *  Tell python to re-scan all library directories
 * @update SQLite library
 */
function libraryDatabaseInit() {
  return new Promise((resolve) => {
    client.invoke("libraryDatabaseInit", (error, res) => {
      if (error) {
        console.error(error);
        resolve;
      } else {
        console.log("Library checked" + toString(res));
        resolve;
      }
    });
  });
}

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
  toSendView.style.display = "none";
  clearEle(viewDrives);
  client.invoke("getDrives", (error, res) => {
    if (error) {
      console.error(error);
      viewDrives.textContent = "drive search busted";
    } else {
      viewDrives.appendChild(createDriveTable(res));
    }
  });
});
getDrives.dispatchEvent(new Event("click"));

let loadLibrary = document.querySelector("#loadLibrary");
loadLibrary.addEventListener("click", () => {
  console.log("click load libray");
  toSendViewRender();
});
//loadLibrary.dispatchEvent(new Event("click"));
loadUsers.addEventListener("click", () => {
  toSendView.style.display = "none";
  todo.style.display = "none";
  displayUserList();
});
loadUsers.dispatchEvent(new Event("click"));
//

submitUser.addEventListener("click", () => {
  toSendView.style.display = "none";
  //console.log(newUserData.location.value, newUserData.userName.value);
  addUser([newUserData.userName.value, newUserData.location.value]);
  //TODO update users list
});
//submitUser.dispatchEvent(new Event("click"));

//display, select-> display-display, select multiple->execute,
// `divName`.appendChild(i()) -> getI -> createITable
/**
 * @function getUsers
 *  Call the python api, get user array
 *      this returns [[id, user, location]]
 *          send data to be made into HTML user table
 * @returns promise resolve {HTML userTable element}
 */
function getUsers() {
  return new Promise((resolve) => {
    client.invoke("getUsers", (error, res) => {
      if (error) {
        console.error(error);
        resolve(error);
      } else {
        resolve(createUserTable(res));
      }
    });
  });
}
/**
 * @function getLibrary
 *  Call the python api, get library array
 *      this returns [[id, track name, location, type, size]]
 *          send data to be made into HTML user table
 * @returns promise resolve {HTML LibraryTable element}
 */
function getLibrary() {
  //await libraryDatabaseInit();
  return new Promise((resolve) => {
    // need to initialize
    client.invoke("getLibrary", (error, res) => {
      if (error) {
        console.error(error);
      } else {
        resolve(createLibraryTable(res));
      }
    });
  });
}

/**
 * @function addUser
 *  Send to the python api
 * @param array [user, location]
 * @update call displayUserList()
 */
function addUser(data) {
  //console.log(data);
  client.invoke("addUser", addUser.value, (error, res) => {
    if (error) {
      console.error(error);
    } else {
      // update the user list
      displayUserList();
    }
  });
}

/**
 * @function displayHistory
 *  update/ init the history element
 * @param int user id
 * @update DOM: userHistory.appendChild()
 */
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
        currentHistory = res;
        userHistory.appendChild(createHistoryTable(res));
      }
    }
  });
}

/**
 * @function displayUserList
 *  update/ init the library element
 * @update DOM: 'users'
 */
function displayUserList() {
  usersView.style.display = "block";
  //userView.style.display = "none";
  clearEle(users);
  async function asyncCallUsers() {
    const result = await getUsers();
    // TODO what if this is blank?
    users.appendChild(result);
    return result;
  }
  asyncCallUsers();
}

/**
 * @function toSendAdd
 *  update/ init the library element
 * @param array [id, name, type, size]
 * @update toSend variable
 * @update "#myTable tbody" with new row
 */
function toSendAdd(data) {
  toSend.push(data);
  totalSendSize = data[3] + totalSendSize;
  if (fileTypesSend.includes(data[2])) {
    fileTypesSend.append(data[2]);
  }
  updateSelected();
  // make file row turns array into valid html tr row
  $("#myTable tbody").append(makeFileRow(data));
}

/**
 * @function toSendUpdate
 *  update global toSend, match how the user has changed it
 * @param array [[1,file],[2,file2]]
 * @update toSend
 */
function toSendUpdate(arr) {
  // modify global object
  toSend = arr;
}

// clear, show, and Update view
/**
 * @function toSendViewRender
 *  update/ init the toSendView row element
 * @update dom clear>block display>append table
 */
function toSendViewRender() {
  clearEle(toSendView);
  toSendView.style.display = "block";
  //console.log(getLibrary());

  asyncCallLibrary().then((col1) => {
    var col2 = createSendTable(toSend);
    toSendView.appendChild(sideBySide([col1, col2]));
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
          let arr = [];
          let table = ui.item[0].parentElement.childNodes;
          table.forEach((row) => {
            let r = [];
            for (var key in row.children) {
              if (row.children.hasOwnProperty(key)) {
                // cell : console.log(row.children[key].textContent);
                r.push(row.children[key].textContent);
              }
            }
            arr.push(r);
          });
          toSendUpdate(arr);
        },
      })
      .disableSelection();
  });

  //toSendView.appendChild(sideBySide([libraryObj, createSendTable(toSend)]));
}

/*
 * take in an ARRAY of table,
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
    //console.log(tables);
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
  table.setAttribute("id", "myLibTable");
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
  tableData.forEach(function (rowData) {
    var row = document.createElement("tr");
    rowData.forEach(function (cellData) {
      // hide ID
      if (cellData != rowData[0]) {
        // convert the size to readable amount
        if (typeof cellData === "number") {
          cellData = bytesConvert(cellData);
        }
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
/*
  Takes a 1 dimensional array and returns a draggable row
*/
function makeFileRow(rowData) {
  let row = document.createElement("tr");
  row.setAttribute("id", rowData[0]);
  row.setAttribute("key", rowData);
  row.setAttribute("class", "ui-sortable-handle");
  rowData.forEach(function (cellData) {
    if (cellData != rowData[3]) {
      var cell = document.createElement("td");
      cell.appendChild(document.createTextNode(cellData));
      //append to form element that you want .
      row.appendChild(cell);
    }
  });
  // add remove onClick cell
  // glyphicon glyphicon-trash
  var cell = document.createElement("td");
  cell.appendChild(
    document.createTextNode("<span class='glyphicon glyphicon-trash'></span>")
  );
  cell.addEventListener("click", function () {
    alert(rowData);
    //removeFromToSend(rowData);
  });
  //append to form element that you want .
  row.appendChild(cell);
  return row;
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
    tableBody.appendChild(makeFileRow(rowData));
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
        viewDrives.style.display = "none";
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
      var cell = document.createElement("td");
      cell.appendChild(document.createTextNode(cellData));
      // Click listener for row
      cell.addEventListener("click", function () {
        // alert data ID
        currentUser = rData;
        updateSelected();
        // display selection
        displayHistory(rData[0]);
        usersView.style.display = "none";
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

document.getElementById("showLocationFinder").addEventListener("click", () => {
  toSendView.style.display = "none";
  pickLibraryLocation.style.display = "block";
});
const { dialog } = require("electron").remote;

document.getElementById("dirs").addEventListener("click", () => {
  addLibraryPath(dialog.showOpenDialog({ properties: ["openDirectory"] }));
});

function addLibraryPath(path) {
  // getPathList;
  console.log(path);
  client.invoke("addLibraryPath", path, (error, res) => {
    if (error) {
      console.error(error);
    } else {
      console.log(res);
      // TODO make these asyncronus
      // reScan the library database, then display it
      // it IS getting scanned, but update isn't working
      // TODO convert init into a promise
      clearEle(toSendView);
      toSendViewRender();
      // this action, of course, runs perfectly
      pickLibraryLocation.style.display = "none";

      // remove add library button
    }
  });
}

function clearEle(elementID) {
  elementID.innerHTML = "";
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
}; /*,
  updateIndex = function (e, ui) {
    alert("hi");
    console.log(e);
    $("td.index", ui.item.parent()).each(function (i) {
      $(this).html(i + 1);
    });
    $("input[type=text]", ui.item.parent()).each(function (i) {
      $(this).val(i + 1);
    });
};*/

// jsfiletree expect 'text' for the user 'view'
// does not have to be unique

function getFileTree() {
  return {
    text: "root",
    children: [
      {
        text: "Root Node Import",
        state: { opened: true },
        a: "sub0",
        children: [
          {
            a: "sub0A",
            b: "foo",
            icon: "glyphicon glyphicon-cd",
          },
          {
            text: "test here",
            a: "sub0B",
            icon: "glyphicon glyphicon-cd",
          },
        ],
      },
      {
        a: "sub1",
      },
    ],
  };
}

function setJsonData(identifier, newTrait, jsonObj) {
  for (var i = 0; i < jsonObj.length; i++) {
    if (jsonObj[i].Id === id) {
      jsonObj[i].Username = newUsername;
      return;
    }
  }
}
function setJsonData(id, newTrait, tree) {
  if (tree.hasOwnProperty(tree.track_id)) {
    if (tree.track_id === id) {
      tree.items = newTrait;
    }
  } else {
    tree.items = tree.items.map(function (item) {
      return updateTree(id, update, item);
    });
  }
  return tree;
}
var data = [{ id: 121, items: [] }];

tree = updateTree(67, data, tree);

//

$.getScript("./dist/jstree.min.js", function () {
  $(function () {
    $("#testTree")
      // listen for click event
      .on("changed.jstree", function (e, data) {
        var i,
          j,
          r = [];
        for (i = 0, j = data.selected.length; i < j; i++) {
          r.push(data.instance.get_node(data.selected[i]).text);
        }
        $("#event_result").html("Selected: " + r.join(", "));
      })
      // create the instance
      .jstree({
        core: {
          data: [
            {
              text: "Root node",
              state: { opened: true },
              children: [
                {
                  text: "Child node 1",
                  state: { selected: true },
                  icon: "glyphicon glyphicon-cd",
                },
                {
                  text: "Child node 2",
                  state: { disabled: true },
                },
                {
                  text: "Child dir 1",
                  state: { opened: true },
                  children: [
                    {
                      text: "Child node 23",
                      icon: "	glyphicon glyphicon-saved",
                    },
                  ],
                },
              ],
            },
            getFileTree(),
            {
              text: "Root node2",
              state: { opened: false },
              children: [
                {
                  text: "Child node 1",
                  icon: ".glyphicon glyphicon-flash",
                },
                {
                  text: "Child node 2",
                  state: { disabled: true },
                },
                {
                  text: "Child dir 1",
                  state: { opened: true },
                  children: [
                    {
                      text: "Child node 3",
                      icon: ".glyphicon glyphicon-flash",
                    },
                  ],
                },
              ],
            }, //
          ],
        },
      })
      .bind("loaded.jstree", function (e, data) {
        // once the tree is loaded
        debugger;
        //$("#tree").jstree("select_node", "#ref565", true);
        // do something to node with this identifier
        // a: 'sub0B'
        $("#testTree").jstree(true).select_node("Child node 23");
        $("#testTree").jstree(false).select_node("Child node 1");
      });
  });
  // $("#testTree").jstree("select_node", "Child node 23");
  // $.jstree.reference("#testTree").select_node("Child node 23");
});
