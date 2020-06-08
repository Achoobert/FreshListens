<!-- index.html -->

<!DOCTYPE html>
<html>
  <head>
    <!-- Bootstrap CSS -->
    <!-- Bootstrap Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <link rel="stylesheet" href="./source/css/bootstrap.min.css" />
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="source/css/styles.css" />
    <script>
      window.$ = window.jQuery = require("jquery");
      require("bootstrap");
      require("jquery-ui-dist/jquery-ui");
      require("popper.js");
    </script>

    <title>Fresh Listens</title>
  </head>
  <header id="header" class="fixed-top">
    <div class="container">
      <div class="logo">
        <h1 class="text-light">
          <span>🎧Tracks🔊</span>
        </h1>
      </div>
      <div id="navBar">
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
          <label class="btn btn-secondary active">
            <input
              type="radio"
              name="Retry Echo"
              id="echoButton"
              autocomplete="off"
            />
            Retry Echo
          </label>
          <label class="btn btn-secondary active">
            <input
              type="radio"
              name="showLocationFinder"
              id="showLocationFinder"
              autocomplete="off"
            />
            Library
          </label>
          <label class="btn btn-secondary active">
            <input
              type="radio"
              name="getDrives"
              id="getDrives"
              autocomplete="off"
            />
            Drive
          </label>
          <label class="btn btn-secondary active">
            <input
              type="radio"
              name="loadUsers"
              id="loadUsers"
              autocomplete="off"
              checked
            />
            User
          </label>
          <label class="btn btn-secondary active">
            <input
              type="radio"
              name="loadLibrary"
              id="loadLibrary"
              autocomplete="off"
            />
            File Send
          </label>
        </div>
      </div>
    </div>
  </header>

  <body id="body">
https://github.com/vakata/jstree#the-required-json-format
<div id="container"></div>
<script>
$(function() {
  $('#container').jstree({
    'core' : {
      'data' : [
            {
              "text" : "Root node",
              "state" : {"opened" : true },
              "children" : [
                  {
                    "text" : "Child node 1",
                    "state" : { "selected" : true },
                    "icon" : "glyphicon glyphicon-flash"
                  },
                  { "text" : "Child node 2", "state" : { "disabled" : true },
                  { "text" : "Child dir 1", "state" : {"opened" : true }  
                    "children" : [
                        {
                        "text" : "Child node 3",
                        "icon" : "glyphicon glyphicon-flash"
                        }, 
                  }
              ]
            }
      ]
    }
  });
});
</script>
