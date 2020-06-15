const electron = require("electron");
const { dialog, ipcMain } = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
let $ = require("jquery");

//const jstree = "./dist/jstree";

//  to run this in test mode
// './node_modules/.bin/electron .'

let mainWindow = null;
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      //nodeIntegration: true,
      enableRemoteModule: true,
      //contextIsolation: false,
      //sandbox: false,
    },
  });

  mainWindow.loadURL(
    require("url").format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
      sandbox: false,
    })
  );

  //cannot .loadFile("index.html"); because version is too old
  mainWindow.webContents.openDevTools();
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
// add these to the end or middle of main.js

let pyProc = null;
let pyPort = null;

const selectPort = () => {
  pyPort = 4242;
  return pyPort;
};

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const PY_DIST_FOLDER = "pycalcdist";
const PY_FOLDER = "pycalc";
const PY_MODULE = "api"; // without .py suffix

const guessPackaged = () => {
  const fullPath = path.join(__dirname, PY_DIST_FOLDER);
  //console.log(fullPath);
  return require("fs").existsSync(fullPath);
};

const getScriptPath = () => {
  if (!guessPackaged()) {
    console.log(path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE));
    return path.join(__dirname, PY_FOLDER, PY_MODULE + ".py");
  }
  if (process.platform === "win32") {
    console.log(path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE));
    return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + ".exe");
  }
  console.log(path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE));
  return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE);
};

// main.js
// the improved version
const createPyProc = () => {
  let script = getScriptPath();
  let port = "" + selectPort();

  if (guessPackaged()) {
    pyProc = require("child_process").execFile(script, [port]);
  } else {
    pyProc = require("child_process").spawn("python", [script, port]);
  }

  if (pyProc != null) {
    console.log(script);
    console.log("child process success on port " + port);
  }
};

const exitPyProc = () => {
  pyProc.kill();
  pyProc = null;
  pyPort = null;
};

app.on("ready", createPyProc);
app.on("will-quit", exitPyProc);
