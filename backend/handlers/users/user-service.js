
/* ----- User handler functions (database operations) ----- */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbConn = require('../../utils/db-connector');
const conf = require('../../../config.json');

const User = dbConn.User;

// ----- Public routes -----

// create a new user
const create = async (params) => {
  console.log('Received API call: users/register');
  try {
    // if username does not already exist, proceed with registration
    if (await User.findOne({ username: params.username })) {
      throw new Error('Username already exists');
    }
    if (params.password.length < 10) {
      throw new Error('Password is too short');
    }
    const user = new User(params);
    // hash the plain text password
    if (params.password) {
      user.hash = bcrypt.hashSync(params.password, 10);
    }
    // The first registered user is given admin rights
    if (await User.countDocuments() === 0) {
      user.isAdmin = true;
    }
    // save new user to database
    await user.save();
    return {};
  } catch (e) {
    return { message: e + ' => User could not be registered' };
  }
};

// authenticate user => Login
const authenticate = async ({ username, password }) => {
  console.log('Received API call: users/authenticate');
  try {
    // verify a user with given username exists
    const user = await User.findOne({ username });
    // verify user exists and given password matches stored hash
    if (user && bcrypt.compareSync(password, user.hash)) {
      const { hash, ...userNoHash } = user.toObject();
      const token = jwt.sign(
        {
          sub: user.id,
          admin: user.isAdmin,
        },
        conf.JWT_SECRET,
        {
          expiresIn: 3600, // token expires after 1 hour
        },
      );
      // return token + user with hash removed
      return {
        ...userNoHash,
        token,
      };
    }
    throw new Error('Check given username and password');
  } catch (e) {
    return { message: e + ' => User could not be logged in' };
  }
};

// ----- Routes requiring authentication -----

// get properties of currently logged in user
const readCurrent = async (id) => {
  console.log('Received API call: users/readCurrent');
  try {
    // retrieve data from db
    const user = await User.findById(id);
    // remove hash before returning user data
    const { hash, ...userNoHash } = user.toObject();
    return { ...userNoHash };
  } catch (e) {
    return { message: e + ' => While reading from database' };
  }
};

// get properties of all users --- ADMIN ONLY
const readAll = async (currentUser) => {
  console.log('Received API call: users/readAll');
  try {
    // verify current user has admin rights
    if (currentUser.admin) {
      // retrieve data from db
      const users = await User.find();
      const usersNoHash = [];
      // remove hash before returning user data
      for (let i = 0; i < users.length; i++) {
        const { hash, ...userNoHash } = users[i].toObject();
        usersNoHash.push({ ...userNoHash });
      }
      return usersNoHash;
    }
    return { message: 'Admin rights required' };
  } catch (e) {
    return { message: e + ' => While reading from database' };
  }
};

// get properties of a single user --- ADMIN ONLY
const read = async (currentUser, id) => {
  console.log('Received API call: users/read');
  try {
    // verify current user has admin rights
    if (currentUser.admin) {
      // retrieve data from db
      const user = await User.findById(id);
      // remove hash before returning user data
      const { hash, ...userNoHash } = user.toObject();
      return { ...userNoHash };
    }
    return { message: 'Admin rights required' };
  } catch (e) {
    return { message: e + ' => While reading from database' };
  }
};

// update properties of a single user
const update = async (currentUser, id, newParams) => {
  console.log('Received API call: users/update');
  try {
    // verify current user has admin rights if updating data of other users
    if (currentUser.admin || currentUser.sub == id) {
      // retrieve data from db
      const user = await User.findById(id);
      // verify user with given id exists
      if (!user) {
        throw new Error('User could not be found');
      }
      // if new username is included, verify it is not already in use
      if (user.username !== newParams.username && await User.findOne({ username: newParams.username })) {
        throw new Error('Username already exists');
      }
      // if new password is included, hash it
      if (newParams.password) {
        newParams.hash = bcrypt.hashSync(newParams.password, 10);
      }
      // only admin may grant and revoke admin rights
      if (user.isAdmin != newParams.isAdmin && currentUser.admin) {
        // verify there is at least one admin in database all the time
        if (newParams.isAdmin === false && (await User.countDocuments({ isAdmin: true }) < 2)) {
          // otherwise disregard change to admin rights
          newParams.isAdmin = user.isAdmin;
        }
      } else {
        // otherwise disregard change to admin rights
        newParams.isAdmin = user.isAdmin;
      }
      // update user with new properties and store to db
      Object.assign(user, newParams);
      await user.save();
      // return updated user details without hash
      const { hash, ...userNoHash } = user.toObject();
      return { ...userNoHash };
    }
    return { message: 'Admin rights required' };
  } catch (e) {
    return { message: e + ' => While updating database' };
    console.log(currentUser.id);
  }
};

// remove a single user --- ADMIN ONLY
const remove = async (currentUser, id) => {
  console.log('Received API call: users/remove');
  try {
    // verify current user has admin rights if removing data of other users
    if (currentUser.admin || currentUser.sub == id) {
      const user = await User.findById(id);
      if (user.isAdmin) {
        // verify there is at least one admin in database all the time
        if (await User.countDocuments({ isAdmin: true }) > 1) {
          // delete user with admin rights
          await User.findOneAndDelete({ _id: id });
          return {};
        }
        return { message: 'Last admin cannot be deleted' };
      }
      // delete user
      await User.findOneAndDelete({ _id: id });
      return {};
    }
    return { message: 'Admin rights required' };
  } catch (e) {
    return { message: e + ' => While removing from database' };
  }
};

module.exports = {
  create,
  authenticate,
  readCurrent,
  readAll,
  read,
  update,
  remove,
};
