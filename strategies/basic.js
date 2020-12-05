/**
 * A module containing all the stratergies defined for authenticating user.
 * @module strategies/basic
 * @author Faizaan Chowdhary
 * @requires passport-http
 * @requires koa-bodyparser
 * @requires /models/Users'
 */
const BasicStrategy = require('passport-http').BasicStrategy;
const users = require('../models/Users');
const bcrypt = require('bcrypt');
/**
 * function to verify the password.
 * @function verifyPassword 
 * @param {object} user - the current user.
 * @param {string} password - the password user has entered.
 * @returns {boolean} returns a boolean indicating weather a match or not.
 */
const verifyPassword = function (user, password) {
  // compare hash of password with the stored hash in the DB
  const isMatch = bcrypt.compareSync(password, user.password);
  return isMatch;
}
/**
 * function to verify if the user exist.
 * @function checkUserAndPass 
 * @param {object} user - the current user.
 * @param {string} password - the password user has entered.
 * @returns {boolean} returns a boolean indicating weather a match or not.
 */
const checkUserAndPass = async (username, password, done) => {
  
  let result;
  
  try {
    result = await users.findByUsername(username);
  } catch (error) {
    console.error(`Error during authentication for user ${username}`);
    return done(error);
  }

  if (result.length) {
    const user = result[0];
    if (verifyPassword(user, password)) {
      //console.log(`Successfully authenticated user ${username}`);
      return done(null, user);
    } else {
      console.log(`Password incorrect for user ${username}`);
    }
  } else {
    console.log(`No user found with username ${username}`);
  }
  return done(null, false);
}

/** @constant {object} An object using passport-http module to verify User. */
const strategy = new BasicStrategy(checkUserAndPass);

/** Stratergy object containing all functions to verfiy user.  */
exports.Sratergy =  module.exports = strategy;