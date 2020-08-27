const electron = require("electron");
const { dialog, ipcMain } = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
let $ = require("jquery");

//const jstree = "./dist/jstree";

//needed to use electron-rebuild via
// npm install --save-dev electron-rebuild and
// npx electron-rebuild
// before I could get npx electron . to work.

//  to run this in test mode
// './node_modules/.bin/electron .'

let mainWindow = null;
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const appLogic = require("./appLogic.js");
