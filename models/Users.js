/**
 * A module to perform CRUD operations on the user table.
 * @requires module:/helpers/database
 * @requires module:bcrypt
 * @module models/Users
 * @author Faizaan Chowdhary
 */
const db = require('../helpers/database');
const bcrypt = require('bcrypt');
/**
 * Get user by their id.
 * @function getById 
 * @param {integer} id of the user.
 * @returns {list} returns list with the first element as the user.
 */
exports.getById = async function getById (id) {
  try {    
    const query = "SELECT * FROM Users WHERE UserId = ?;";
    const values = [id];
    const data = await db.run_query(query, values);
    return data;
  } catch(err) {
    throw err
  }
}
/**
 * Get user by their username
 * @function getByUsername 
 * @param {string} username of the user.
 * @returns {list} returns list with the first element as the user.
 */
exports.findByUsername = async function getByUsername(username) {
  try{
    const query = "SELECT * FROM Users WHERE username = ?;";
    const user = await db.run_query(query, username);
    return user;
  } catch(err) {
    throw err
  }
}
/**
 * List all the users in the database
 * get the user by their username
 * @function getAll 
 * @returns {list} returns a list with all the users in users table.
 */
exports.getAll = async function getAll() {
  try{
    const query = "SELECT * FROM Users;";
    const data = await db.run_query(query);
    return data;
  } catch (err) {
  throw err
  }
}
/**
 * Create a new user in the database
 * @function add 
 * @param {Object} user - The user who needs to be added.
 * @param {string} user.username - The username of the user.
 * @param {string} user.role - The role of the user.
 * @param {string} user.email - The email of the user.
 * @param {string} user.password - The password of the user.
 * @returns {object} returns data related to the row affected and id.
 */
exports.add = async function add (user) {
  try{    
    delete user['signupcode']
    const query = "INSERT INTO Users SET ?";
    const password = user.password;
    const hash = bcrypt.hashSync(password, 10);
    user.password = hash;   
    const data = await db.run_query(query, user);
    return data;
    } catch (err) {
    throw err
  }
}
/**
 * Delete user by its id
 * @function DeleteAgentByID 
 * @param {integer} id of the user.
 * @returns {object} returns data related to the row affected.
 */
exports.DeleteAgentByID = async function DeleteAgentByID (id) {
  try{
    const query = "DELETE FROM Users WHERE UserId = ?;";
    const values = [id];
    const data = await db.run_query(query, values);
    return data;
  } catch (err) {
    throw err
  }
}
/**
 * Update an existing user by id
 * @function update 
 * @param {Object} user - The user who needs to be updated.
 * @param {string} user.username - The username of the user.
 * @param {string} user.role - The role of the user.
 * @param {string} user.email - The email of the user.
 * @param {string} user.password - The password of the user.
 * @returns {object} returns data related to the row affected and id.
 */
exports.update = async function update (user) {
  const query = "UPDATE Users SET ? WHERE UserId = ?;";
  const password = user.password;
  const hash = bcrypt.hashSync(password, 10);
  user.password = hash;
  const values = [user, user.UserId];
  const data = await db.run_query(query, values);
  return data;
}