
/* ----- Backend server ----- */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errHandler = require('../handlers/error-handler');
const jwtAuth = require('./jwt-auth');
const conf = require('../../config.json');
const server = {};
const port = conf.BACKEND_LISTEN_PORT;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// JWT Authentication
app.use(jwtAuth());

// Routes
app.use('/api/users', require('../handlers/users/user-controller'));

// Error handler
app.use(errHandler);

// Start Server
server.init = () => {
  app.listen(port, () => {
    console.log('\x1b[35mBackend listening on port %s\x1b[0m', port);
  });
};

module.exports = server;
