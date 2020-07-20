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
let client = new zerorpc.Client({ timeout: 60, heartbeatInterval: 60000 });
client.connect("tcp://127.0.0.1:4242");
/////const jstree = require("./node_modules/jstree/dist/jstree.min.js");
//let jstree = new jstree.Client();

let loadUsers = document.querySelector("#loadUsers");
let getDrives = document.querySelector("#getDrives");
let viewDrives = document.querySelector("#viewDrives");
let viewDriveTable = document.querySelector("#viewDriveTable");
let submitUser = document.querySelector("#submitUser");
let users = document.querySelector("#users");

let sendFiles = document.querySelector("#sendFiles");
let scanLibrary = document.querySelector("#scanLibrary");

let selected = document.querySelector("#selected");
let toSendSize = document.querySelector("#toSendSize");
let libraryLocation = document.querySelector("#libraryLocation");
let libraryLocationTable = document.querySelector("#libraryLocationTable");

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

// user selection variables
// If use push, important to initialize
var currentUser = [];
var currentHistory = [];
var selectedDrive = [];
// currently selected tracks to send to drive
var toSend = [];
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

  console.log(
    "user: " +
      currentUser[1] +
      "  Drive: " +
      selectedDrive[0] +
      "  Total send size: " +
      bytesConvert(totalSendSize) +
      "  " +
      fileTypesSend
  );
}

///// debugging stuff, delete later
let echoButton = document.querySelector("#echoButton");

echoButton.addEventListener("click", () => {
  //console.log("click");
  // console.log($("#testTree").jstree(true).get_node("Child node 23"));
  //$("#testTree").jstree(false).select_node("Child node 1");
  client.invoke("echo", "api.py -> app.py working", (error, res) => {
    echoButton.style.display = "block";
    if (error) {
      console.error(error);
    } else {
      echoButton.style.display = "none";
      //console.log(res);
    }
  });
});
echoButton.dispatchEvent(new Event("click"));
///// end debug

// Make a single page app
let usersView = document.querySelector("#usersView");
let toSendView = document.querySelector("#toSendView");
let newUserData = document.querySelector("#newUserData");

/**
 * @function libraryDatabaseRecheck
 *  Tell python to re-scan all library directories
 * @update SQLite library
 */
function libraryDatabaseRecheck() {
  return new Promise((resolve) => {
    client.invoke("libraryDatabaseRecheck", (error, res) => {
      if (error) {
        console.error(error);
        // retry
        resolve(libraryDatabaseRecheck());
      } else {
        console.log("Library checked " + res);
        libraryLatest = 1;
        resolve(1);
      }
    });
  });
}

sendFiles.addEventListener("click", () => {
  console.log([toSend, currentUser[0], selectedDrive[0]]);
  client.invoke(
    "sendFiles",
    [toSend, currentUser[0], selectedDrive[0]],
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

scanLibrary.addEventListener("click", () => {
  console.log("click");
  debugger;
  client.invoke("libraryDatabaseRecheck", (error, res) => {
    if (error) {
      console.error(error);
    } else {
      console.log(res);
    }
  });
});

function displayNone() {
  toSendView.style.display = "none";
  usersView.style.display = "none";
  libraryLocation.style.display = "none";
  sendFiles.style.display = "none";
  viewDrives.style.display = "none";
}

getDrives.addEventListener("click", () => {
  console.log("clicked get drives");
  getDrives.class = "btn btn-secondary active";
  displayNone();
  viewDrives.style.display = "block";
  viewDriveTable.style.display = "block";
  client.invoke("getDrives", (error, res) => {
    if (error) {
      console.error(error);
      viewDriveTable.textContent = "drive search busted";
    } else {
      clearEle(viewDriveTable);
      viewDriveTable.appendChild(createDriveTable(res));
    }
  });
});
//getDrives.dispatchEvent(new Event("click"));

let loadLibrary = document.querySelector("#loadLibrary");
loadLibrary.addEventListener("click", () => {
  console.log("click load library");
  // TODO fix this
  displayNone();
  toSendView.style.display = "block";
  sendFiles.style.display = "block";
});

loadUsers.addEventListener("click", () => {
  displayNone();
  usersView.style.display = "block";
  users.style.display = "block";
  displayUserList();
});
//$(function () {
//loadUsers.dispatchEvent(new Event("click"));
//$("#loadUsers").click();
//});
//

document.getElementById("showLocationFinder").addEventListener("click", () => {
  displayNone();
  displayPathList();
  //libraryLocation.appendChild(getPathList());
  libraryLocation.style.display = "block";
});

submitUser.addEventListener("click", () => {
  //refreshTree();
  //showHistoryNodes(["1", "2", "3", "4"]);

  displayNone();
  viewDrives.style.display = "block";
  //console.log([newUserData.location.value, newUserData.userName.value]);
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
  displayNone();
  usersView.style.display = "block";
  users.style.display = "block";
  return new Promise((resolve) => {
    client.invoke("getUsers", (error, res) => {
      if (error) {
        console.error(error);
        // try again
        resolve(getUsers());
      } else if (res.length == 0) {
        // no users in table, so don't make table
        console.log("no users");
      } else {
        // make the user table
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
  //await libraryDatabaseRecheck();
  displayNone();
  //usersView.style.display = "block";
  return new Promise((resolve) => {
    client.invoke("getLibrary", (error, res) => {
      if (error) {
        console.error(error);
        resolve(getLibrary());
      } else {
        //console.log(JSON.parse(res));
        resolve(res);
      }
    });
  });
}

/**
 * @function getPathList
 *  Call the python api, get PathList array
 *      this returns [location]
 *          send data to be made into HTML user table
 * @returns promise resolve {HTML LibraryTable element}
 */
function getPathList() {
  return new Promise((resolve) => {
    client.invoke("getPathList", (error, res) => {
      if (error) {
        console.error(error);
        // try again
        resolve(getPathList());
      } else if (res == undefined || res.length == 0 || res == false) {
        console.log("no Paths");
        resolve(false);
      } else {
        resolve(res);
      }
    });
  });
}

/**
 * @function displayPathList
 *  update/ init the library element
 * @update DOM: 'users'
 */
function displayPathList() {
  displayNone();
  libraryLocation.style.display = "block";
  async function asyncCall() {
    const result = await getPathList();
    console.log(result);
    // make the table, then append
    if (result === false) {
      return;
    }
    clearEle(libraryLocationTable);
    libraryLocationTable.appendChild(createPathTable(result));
    //users.appendChild(result);
    return result;
  }
  asyncCall();
}

/**
 * @function addUser
 *  Send to the python api
 * @param array [user, location]
 * @update call displayUserList()
 */
function addUser(data) {
  console.log(data);
  client.invoke("addUser", data, (error, res) => {
    if (error) {
      console.error(error);
    } else {
      // update the user list
      console.log(res);
      displayUserList();
    }
  });
}

/**
 * @function getHistory
 *  get user history
 * @param int user id
 */
function getHistory(userId) {
  let getter = new Promise((resolve, reject) => {
    client.invoke("getHistory", userId, (error, res) => {
      if (error) {
        console.error(error);
      } else {
        if (res == null || res == undefined) {
          console.log("no history returned");
          currentHistory = [];
          resolve(currentHistory);
          //return [1];
        } else if (res.length == 0) {
          console.log("No Data...");
          currentHistory = [];
          resolve(currentHistory);
          //return [1];
        } else {
          currentHistory = res;
          resolve(currentHistory);
          //return res;
        }
      }
    });
  });

  getter.then((arr) => {
    console.log(arr);
    displayHistory(arr);
  });
}

/**
 * @function displayUserList
 *  update/ init the library element
 * @update DOM: 'users'
 */
function displayUserList() {
  async function asyncCallUsers() {
    const result = await getUsers();
    clearEle(users);
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
  console.log(data);
  totalSendSize = data[3] + totalSendSize;
  if (!fileTypesSend.includes(data[2])) {
    console.log("adding filetype");
    fileTypesSend.push(data[2]);
  }
  updateSelected();
  // make file row turns array into valid html tr row
  $("#myTable tbody").append(makeSortFileRow(data));
}

/**
 * @function toSendRemove
 *  remove/ update the library element
 * @param array [id, name, type, size]
 * @update toSend variable
 * @update "#myTable tbody" ,remove existing row
 */
function toSendRemove(data) {
  toSend = toSend.filter(function (ele) {
    return ele[0] != data[0];
  });
  // TODO re-enable selection of track from library
  reEnableDeleted([data[0]]);
  // reduce total send size
  totalSendSize = totalSendSize - data[3];
  updateSelected();
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
  var col1 = createLibraryTable();
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
              r.push(row.children[key].textContent);
            }
          }
          arr.push(r);
        });
        toSendUpdate(arr);
      },
    })
    .disableSelection();
  //});

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
    row.appendChild(table);
  });
  container.appendChild(row);
  return container;
  //}
}

function moveSelected() {}
function unMountDrive() {}

/*
  Takes formated tree and puts it in an formatted html
  to be aligned properly
  has to be .appendChild to the desired div element
  users.appendChild(createTable(res));
  TODO have event listener be a passed variable?
*/
function createLibraryTable() {
  var jsFileTreeLibrary = document.createElement("jsFileTreeLibrary");
  jsFileTreeLibrary.setAttribute("id", "jsFileTreeLibrary");
  // formatting box
  return makeOuterBox(jsFileTreeLibrary);
}
function createTable(tableData) {
  var table = document.createElement("table");
  var tableBody = document.createElement("tbody");
  tableData.forEach(function (rowData) {
    //skips the third element in array though
    tableBody.appendChild(makeFileRow(rowData));
  });
  table.appendChild(tableBody);
  return makeOuterBox(table);
}
/*
  Takes a 1 dimensional array and returns a row
*/
function makeFileRow(rowData) {
  console.log(rowData);
  let row = document.createElement("tr");
  row.setAttribute("id", rowData[0]);
  row.setAttribute("key", rowData);
  rowData.forEach(function (cellData) {
    if (cellData != rowData[3]) {
      var cell = document.createElement("td");
      cell.appendChild(document.createTextNode(cellData));
      //append to form element that you want .
      row.appendChild(cell);
    }
  });
  return row;
}
// return a non-sortable tableHead le
function createHeader(hData) {
  var tableHead = document.createElement("thead");
  let row = makeFileRow(hData);
  return tableHead.appendChild(row);
}
/*
  Takes a 1 dimensional array and returns a draggable, deleteable row
*/
function makeSortFileRow(rowData) {
  let row = makeFileRow(rowData);
  row.setAttribute("class", "ui-sortable-handle");
  // add remove onClick cell
  // glyphicon glyphicon-trash
  let cell = document.createElement("td");
  cell.setAttribute("class", "ui-deleteable-handle");
  cell.appendChild(document.createTextNode("✖"));
  cell.addEventListener("click", function () {
    toSendRemove(rowData);
    $(this).parent().remove();
    // TODO UnDisable the tree node
    // jsTreeEnableNode($(this).parent())
  });
  row.appendChild(cell);

  return row;
}
function makeOuterBox(table) {
  var outerBox = document.createElement("outerBox");
  outerBox.setAttribute("class", "col-lg-12");
  outerBox.appendChild(table);
  return outerBox;
}
function createSendTable(tableData) {
  // table formatting
  var table = document.createElement("table");
  table.setAttribute("class", "table table-hover");
  table.setAttribute("id", "myTable");
  // make a non-sortable tableHead and attach it to the table
  table.appendChild(createHeader(["#", "File Name", "Type", "", "  "]));
  var tableBody = document.createElement("tbody");
  tableBody.setAttribute("class", "ui-sortable");
  //create body
  tableData.forEach(function (rowData) {
    tableBody.appendChild(makeSortFileRow(rowData));
  });
  table.appendChild(tableBody);
  // formatting box
  return makeOuterBox(table);
}
function createDriveTable(tableData) {
  var table = document.createElement("table");
  var tableBody = document.createElement("tbody");
  tableBody.setAttribute("class", "ui-sortable");
  tableData.forEach(function (rowData) {
    var row = document.createElement("tr");
    rowData.forEach(function (cellData) {
      var cell = document.createElement("td");
      cell.appendChild(document.createTextNode(cellData));
      cell.addEventListener("click", function () {
        selectedDrive = rowData;
        updateSelected();
        loadLibrary.dispatchEvent(new Event("click"));
      });
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  // formatting box
  return makeOuterBox(table);
}
function createUserTable(tableData) {
  var table = document.createElement("table");
  table.setAttribute("id", "userTable");
  // make a non-sortable tableHead and attach it to the table
  table.appendChild(createHeader(["#", "Name", "Location"]));

  var tableBody = document.createElement("tbody");
  tableBody.setAttribute("class", "ui-sortable");

  tableData.forEach(function (rowData) {
    var row = document.createElement("tr");
    row.setAttribute("class", "ui-selectable-handle");
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
        getHistory(rData[0]);
        getDrives.dispatchEvent(new Event("click"));
      });
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  // formatting box
  return makeOuterBox(table);
}
function createPathTable(tableData) {
  var table = document.createElement("table");
  table.setAttribute("id", "pathTable");
  // make a non-sortable tableHead and attach it to the table
  table.appendChild(createHeader(["Location"]));

  var tableBody = document.createElement("tbody");
  tableBody.setAttribute("class", "ui-selectable");
  console.log(tableData);
  tableData.forEach(function (rowData) {
    var row = document.createElement("tr");
    row.setAttribute("class", "ui-selectable-handle");
    var cell = document.createElement("td");
    cell.appendChild(document.createTextNode(rowData));
    row.appendChild(cell);
    tableBody.appendChild(row);
  });
  table.appendChild(tableBody);
  // formatting box
  return makeOuterBox(table);
}
const { dialog } = require("electron").remote;

document.getElementById("dirs").addEventListener("click", () => {
  addLibraryPath(dialog.showOpenDialog({ properties: ["openDirectory"] }));
});

function addLibraryPath(path) {
  // displayPathList();
  console.log(path[0]);
  client.invoke("addLibraryPath", path[0], (error, res) => {
    if (error) {
      console.error(error);
    } else {
      console.log(res);
      // TODO make these asyncronus
      // reScan the library database, then display it
      // it IS getting scanned, but update isn't working
      // TODO convert init into a promise
      clearEle(toSendView);
      asyncUpdateLibrary(path[0]).then(function () {
        toSendViewRefresh();
        displayPathList();
      });
      libraryLocation.style.display = "none";

      // remove add library button
    }
  });
}

function clearEle(elementID) {
  console.log("Clearing");
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
};
//import updateTree from jstree
function updateTree(a, b, c) {
  // TODO fix this
  return 1;
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

var tree = updateTree(67, data, tree);

// Define some functions so I can access the internal Data
var refreshTree, reEnableDeleted, displayHistory;

//$.when(asyncCallLibrary()).done(function (result) {
asyncCallLibrary().then(function () {
  //console.log(result); // logs 1. should log json
  //Make side-by-side
  toSendViewRender();
  // make tree
  $.getScript("./dist/jstree.min.js", function () {
    $(function () {
      $("#jsFileTreeLibrary")
        /*
         * On click
         */
        .on("changed.jstree", function (e, data) {
          let i,
            j = 0;

          for (i = 0, j = data.selected.length; i < j; i++) {
            let select = data.instance.get_node(data.selected[i]); //.text
            console.log(select);
            select.state.disabled = true;
            $(this) // TODO This formatting Does Not Stick
              .find("#" + select.id)
              .css("color", "red");
            //select.a_attr.class = ".jstree-default .jstree-historical";
            if (select.original.hasOwnProperty("track_data")) {
              // [id, name, type, size]
              toSendAdd(select.original.track_data);
            }
            //$("#event_result").html("Selected: " + select.join(", "));
            // .jstree-default .jstree-historical
          }
        })
        /*
         * Make the tree from the json data
         */
        .jstree({
          core: {
            data: [JSON.parse(libraryObj)],
          },
        })
        /*
         * When tree is loaded
         * Functions can be called from outside
         */
        .bind("loaded.jstree", function (e, data) {
          // once library is loaded, display the first page
          loadUsers.dispatchEvent(new Event("click"));

          // ~~~~~~~~~~~~~~~~~~~~ //
          ///// global start //////
          /**
           * @function displayHistory
           *  update/ elements in library which match history
           * @param int user id
           * @update DOM:
           */

          displayHistory = function (ids) {
            console.log("trying....");
            ids.forEach((id) => {
              console.log(id);
              // select the node
              let select = data.instance.get_node(id);
              console.log(select);
              select.icon = "glyphicon glyphicon-ok-circle";
              // do things to node
              // select.state.disabled = true;
              $(this)
                .find("#" + id)
                .css("color", "red");
            });
            // a) do some jquery
            // find node where
            //$("#myTable tbody").append(makeFileRow(data));
            //$("#testTree li").css("color", "red");
            /*
            $("#jsFileTreeLibrary li")
              .find("#" + id) //+ toString(1)
              .css("color", "red");
            id="jsFileTreeLibrary"
            role="tree"
            class="jstree jstree-2 jstree-default"

            fine where
            li
            role="treeitem"
            id="1"

            update the
            a / i jstree icon?
            */
            // update node properties
            //refresh whole tree?
            // b) edit the json tree
            //open tree
            //edit nodes
            //rebuild the jstree somehow
            //
            // c) Update from within the jquery
            // that initially built the tree
            // can it update later if user changes?
          };
          reEnableDeleted = function (ids) {
            ids.forEach((id) => {
              let select = data.instance.get_node(id);
              //console.log(select);
              // do things to node
              select.state.disabled = false;
            });
          };
          ///// global end //////
          // ~~~~~~~~~~~~~~~~~~~~ //
          // Resets all formatting on tree
          refreshTree = function () {
            data.instance.refresh();
          };
        });
      $("#jsFileTreeLibrary").on("changed.jstree", function (e, data) {
        //$("#testTree").jstree().refresh();
        console.log("The selected (library) nodes are:");
        console.log(data.selected);
        //console.log($("#testTree").jstree(data).delete_node(data));
      });
    });
  });
});
