const { remote } = require("electron");
require("./dist/bootstrap-3.3.7-dist/js/bootstrap.js");

// const Square = require('./square.js');
// const mySquare = new Square(2);
// console.log(`The area of mySquare is ${mySquare.area()}`);
const appLogic = remote.require("./appLogic.js");
const client = new appLogic(2);
//console.log(`an app variable is ${client.history()}`);
// this setup ONLY allows access to module exports class

// ~~~~~~~is remote working~~~~~~~~~~~
//console.log(client.hi());
console.log(client.echo("Bounce me back"));
//console.log(client.testCaller("renderer here, "));

async function displayContent() {
  let caller = await client.library.getTree();
  libraryObj = caller[0];
  console.log(caller);
}

displayContent().catch((e) => console.log(e));

//console.log(caller);
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
var toSend = [];
var currentUser = [];
var currentHistory = [];
var selectedDrive = [];
// currently selected tracks to send to drive
var toSend = [];
var fileTypesSend = [];
var totalSendSize = 0;

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
      client.library.getLibrary().then((result) => {
        console.log(result);
        libraryObj = result;
        resolve(result);
      });
    } else {
      libraryLatest = 1;
      resolve(libraryObj);
    }
  });
}
async function getLibrary() {
  //await libraryDatabaseRecheck();
  //displayNone();
  //usersView.style.display = "block";
  let caller = await client.library.getTree();
  libraryObj = caller[0];
  console.log("depreciate me");
  return "I'm not in use";
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
let toSendView = document.querySelector("#toSendView");

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

//$.when(asyncCallLibrary()).done(function (result) {
asyncCallLibrary().then(function () {
  //console.log(result); // logs 1. should log json
  //Make side-by-side
  toSendViewRender();
  // make tree
  $.getScript("./dist/jstree.js", function () {
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
            data: libraryObj,
          },
        })
        /*
         * When tree is loaded
         * Functions can be called from outside
         */
        .bind("loaded.jstree", function (e, data) {
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

function makeOuterBox(table) {
  var outerBox = document.createElement("outerBox");
  outerBox.setAttribute("class", "col-lg-12");
  outerBox.appendChild(table);
  return outerBox;
}
function createLibraryTable() {
  var jsFileTreeLibrary = document.createElement("jsFileTreeLibrary");
  jsFileTreeLibrary.setAttribute("id", "jsFileTreeLibrary");
  // formatting box
  return makeOuterBox(jsFileTreeLibrary);
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

const { dialog } = require("electron").remote;

function clearEle(elementID) {
  console.log("Clearing");
  elementID.innerHTML = "";
}
