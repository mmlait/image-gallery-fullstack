
/* ----- User request handler ----- */

const express = require('express');
const userService = require('./user-service');

const router = express.Router();

// register new user
const register = (req, res, next) => {
  userService.create(req.body)
    .then((success) => {
      if (success) {
        return res.json(success);
      }
      return res.status(400).json({ message: 'Encountered problem creating user, please try again' });
    })
    .catch(err => next(err));
};

// autheticate existing user
const authenticate = (req, res, next) => {
  userService.authenticate(req.body)
    .then((user) => {
      if (user) {
        return res.json(user);
      }
      return res.status(401).json({ message: 'Check username and password.' });
    })
    .catch(err => next(err));
};

// get current user details
const readCurrent = (req, res, next) => {
  userService.readCurrent(req.user.sub)
    .then((user) => {
      if (user) {
        return res.json(user);
      }
      return res.status(404).json({ message: 'Not found' });
    })
    .catch(err => next(err));
};

// get user details based on id
const readAll = (req, res, next) => {
  userService.readAll(req.user)
    .then((users) => {
      if (users) {
        return res.json(users);
      }
      return res.status(404).json({ message: 'Not found' });
    })
    .catch(err => next(err));
};

// get user details based on id
const read = (req, res, next) => {
  console.log(req);
  console.log(req.user);
  console.log(req.query.id);
  userService.read(req.user, req.query.id)
    .then((user) => {
      if (user) {
        return res.json(user);
      }
      return res.status(404).json({ message: 'Not found' });
    })
    .catch(err => next(err));
};

// update user details based on id
const update = (req, res, next) => {
  userService.update(req.user, req.query.id, req.body)
    .then((user) => {
      if (user) {
        return res.json(user);
      }
      return res.status(400).json({ message: 'Occured while updating user' });
    })
    .catch(err => next(err));
};

// remove user based on id
const remove = (req, res, next) => {
  userService.remove(req.user, req.query.id)
    .then((user) => {
      if (user) {
        return res.json(user);
      }
      return res.status(400).json({ message: 'Occured while removing user' });
    })
    .catch(err => next(err));
};

// API routes
router.post('/register', register);
router.post('/authenticate', authenticate);
router.get('/current', readCurrent);
router.get('/readAll', readAll);
router.get('/read', read);
router.put('/update', update);
router.delete('/remove', remove);

module.exports = router;
