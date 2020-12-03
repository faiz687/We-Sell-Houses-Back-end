const db = require('../helpers/database');
const bcrypt = require('bcrypt');

//get a single estate agent by its id  
exports.getById = async function getById (id) {
  const query = "SELECT * FROM Users WHERE UserId = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}

//get a single estate agent by the (unique) username
exports.findByUsername = async function getByUsername(username) {
  const query = "SELECT * FROM Users WHERE username = ?;";
  const user = await db.run_query(query, username);
  return user;
}


//list all the estate agent in the database
exports.getAll = async function getAll() {
  const query = "SELECT * FROM Users;";
  const data = await db.run_query(query);
  return data;
}


//create a new estate agent in the database
exports.add = async function add (user) {
  delete user['signupcode']
  const query = "INSERT INTO Users SET ?";
  const password = user.password;
  const hash = bcrypt.hashSync(password, 10);
  user.password = hash;   
  const data = await db.run_query(query, user);
  return data;
}

//delete a estate agent by its id
exports.DeleteAgentByID = async function DeleteAgentByID (id) {
  const query = "DELETE FROM Users WHERE UserId = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}

//update an existing estate agent
exports.update = async function update (user) {
  const query = "UPDATE Users SET ? WHERE UserId = ?;";
  const password = user.password;
  const hash = bcrypt.hashSync(password, 10);
  user.password = hash;
  const values = [user, user.UserId];
  const data = await db.run_query(query, values);
  return data;
}