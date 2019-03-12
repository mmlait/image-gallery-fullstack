
/* ----- Error handler for backend ----- */

const errHandler = (err, req, res, next) => {
  if (typeof (err) === 'string') {
    // app specific error
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err.name === 'UnauthorizedError') {
    // jwt authentication failed
    return res.status(401).json({
      message: 'Invalid Token',
    });
  }

  if (err.name === 'ValidationError') {
    // mongoose validation failed
    return res.status(401).json({
      message: err.message,
    });
  }

  // default
  console.error(err);
  return res.status(500).json({
    message: 'Something went wrong: ' + err.message,
  });
};

module.exports = errHandler;
