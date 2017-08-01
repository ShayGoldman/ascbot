const express = require("express");
const path = require("path");

class ServePublicFiles {

  attachTo(app) {
    app.use("/", express.static(path.join(__dirname, "/../../dist")));
  }
}

module.exports = ServePublicFiles;