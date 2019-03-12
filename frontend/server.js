
/* ----- Frontend server ----- */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const conf = require('../config.json');
const cookieParser = require('cookie-parser')
const app = express();
const port = conf.FRONTEND_LISTEN_PORT;
const server = {};


app.use(bodyParser.urlencoded({ extend: false}));
app.use(cookieParser());
app.use("/static", express.static("frontend/public"));
app.use("/", require("./routes"));

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));

// Start Server
server.init = () => {
app.listen(port, () => console.log(`\x1b[32mFrontend listening on port %s\x1b[0m`, port))
};


module.exports = server;
