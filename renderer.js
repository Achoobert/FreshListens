// renderer.js
//In renderer.js, we have codes for initialization of zerorpc client, and the code for watching the changes in the
//input. Once the user
//types some formula into the text area, the JS send the text to Python backend and retrieve the computed result.

const zerorpc = require("zerorpc");
let client = new zerorpc.Client();
let client2 = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");

let formula = document.querySelector("#formula");
let result = document.querySelector("#result");

formula.addEventListener("input", () => {
  client.invoke("calc", formula.value, (error, res) => {
    if (error) {
      console.error(error);
    } else {
      result.textContent = res;
    }
  });
  //
  client.invoke("getLibrary", (error, res) => {
    if (error) {
      console.error(error);
    } else {
      library.textContent = res;
    }
  });
  //
  client.invoke("helloworld", formula.value, (error, res) => {
    if (error) {
      console.error(error);
    } else {
      helloworld.textContent = res;
    }
  });
});
formula.dispatchEvent(new Event("input"));

//Library
let library = document.querySelector("#library");
//test
let helloworld = document.querySelector("#helloworld");
// User
let users = document.querySelector("#users");
