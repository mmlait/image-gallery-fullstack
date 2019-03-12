
/* ----- Application Init file ----- */

const mongoose = require('mongoose');
const serverBackend = require('./backend/utils/server');
const serverFrontend = require('./frontend/server');

const app = {};

const checkDbConnection = (callback) => {
  if (mongoose.connection.readyState !== 1) {
    setTimeout(() => {
      checkDbConnection(() => {
        callback();
      });
    }, 200);
  } else if (mongoose.connection.readyState === 1) {
    // Start frontend server once connection to the database is established
    callback();
    setTimeout(() => {
      console.log('System running...');
    }, 2000)
  }
};

app.init = () => {
  // Start backend server
  serverBackend.init();
  // Check if db connection is established
  checkDbConnection(() => {
    serverFrontend.init();
  });
};

// For explicitly start running project using: node ./index.js
if (require.main === module) {
  app.init();
}

// In case of adding test runner etc.
module.exports = app;
