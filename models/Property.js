const db = require('../helpers/database');

//get a single property by its id  
exports.getById = async function getById (id) {
  const query = "SELECT Houses.houseid , title , description , category , offerprice , location , imageURL , underoffer ,  highpriority , dateCreated ,  UserId ,  group_concat(feature) as feature FROM Houses LEFT JOIN  Feature on Houses.houseid = Feature.houseid where Houses.houseid = ? group by houseid ;"
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}

//list all the property in the database
exports.getAll = async function getAll (page, limit, order, direction) {
  const offset = (page - 1) * limit;
  let query;
  if (direction === 'DESC') {    
    query = "SELECT * FROM Houses ORDER BY ?? DESC LIMIT ? OFFSET ?;";
  } else {
    query = "SELECT * FROM Houses ORDER BY ?? ASC LIMIT ? OFFSET ?;";    
  }
  const values = [order, parseInt(limit), parseInt(offset)];
  const data = await db.run_query(query, values);
  console
  return data;
}

//create a new property in the database
exports.add = async function add(house) {
  const query = "INSERT INTO Houses SET ?";
  const data = await db.run_query(query, house);
  return data; 
}

//delete property by its id
exports.delById = async function delById (id) {
  const query = "DELETE FROM Houses WHERE houseid = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}

//update an existing property
exports.update = async function update (House) {
  const query = "UPDATE Houses SET ? WHERE houseid = ?;";
  const values = [House, House.houseid];
  const data = await db.run_query(query, values);
  return data;
}

//Total count of  properties
exports.gettotalcount = async function gettotalcount() {
  const query = "select COUNT(houseid) as totalhouse from Houses;";
  const data = await db.run_query(query);
  return data;
}

