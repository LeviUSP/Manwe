const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const server = express();

mongoose.connect(
  "mongodb+srv://admin:admin@manwe-dltvw.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(morgan("dev"));
server.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

server.use(require("./routes"));
server.listen(3333);
