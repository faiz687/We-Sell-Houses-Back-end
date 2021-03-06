/**
 * A module to perform CRUD operation on the Houses table.
 * @requires module:/helpers/database
 * @module models/Property
 * @author Faizaan Chowdhary
 */
const db = require('../helpers/database');
/**
 * Get property by their id.
 * @function getById 
 * @param {integer} id of the house.
 * @returns {object} reuturns object with all the properties of the house.
 */
exports.getById = async function getById (id) {
  try{
    const query = "SELECT Houses.houseid , title , description , category , offerprice , location , imageURL , underoffer ,  highpriority , dateCreated ,  UserId ,  group_concat(feature) as feature FROM Houses LEFT JOIN  Feature on Houses.houseid = Feature.houseid where Houses.houseid = ? group by houseid ;"
    const values = [id];
    const data = await db.run_query(query, values);
    return data;
  } catch (err) {
    throw err
  }
}
/**
 * List all the houses in the database
 * @function getAll 
 * @param {string} page the client is on.
 * @param {string} limit the number of houses to display.
 * @param {string} order by which property of the house.
 * @param {string} direction going to view the page DESC or ASC.
 * @returns {list} returns a list with all the users in users table.
 */
exports.getAll = async function getAll (page, limit, order, direction) {
  try {
    const offset = (page - 1) * limit;
    let query;
    if (direction === 'DESC') {  
      query = "SELECT * FROM Houses ORDER BY ?? DESC LIMIT ? OFFSET ?;";
    } else {
      query = "SELECT * FROM Houses ORDER BY ?? ASC LIMIT ? OFFSET ?;";    
    }
    const values = [order, parseInt(limit), parseInt(offset)];
    const data = await db.run_query(query, values);
    return data;        
  } catch (err) {
    throw err
  }  
}
/**
 * Create a new house in the database
 * @function add 
 * @param {Object} house - The house that needs to be added.
 * @param {string} house.Title - The title of the house.
 * @param {string} house.description - The description of the house.
 * @param {string} house.category - The category of the house.
 * @param {integer} house.offerprice - The offerprice for the house.
 * @param {string} house.location - The location of the house.
 * @param {string} house.imageURL - The imageurl of the house.
 * @param {boolean} house.underoffer - Is the house underoffer.
 * @param {boolean} house.highpriority - Is it high highpriority to sell.
 * @param {boolean} house.activated - archived or not.
 * @param {integer} house.userid - userid of the estage agent.
 * @returns {object} returns data related to the row created and id.
 */
exports.add = async function add(house) {
  try{
    const query = "INSERT INTO Houses SET ?";
    const data = await db.run_query(query, house);
    return data; 
  }catch (err){
   throw err 
  }
}
/**
 * Delete a house by its id
 * @function delById 
 * @param {integer} id of the house.
 * @returns {object} returns data related to the row affected.
 */
exports.delById = async function delById (id) {
  try{
    const query = "DELETE FROM Houses WHERE houseid = ?;";
    const values = [id];
    const data = await db.run_query(query, values);
    return data;
  } catch(err) {
    throw err
  }
}
/**
 * update a house in the database by its id
 * @function update 
 * @param {Object} house - The house that needs to be updated.
 * @param {integer} house.houseid - The house-id that needs to be updated.
 * @param {string} house.Title - The title of the house.
 * @param {string} house.description - The description of the house.
 * @param {string} house.category - The category of the house.
 * @param {integer} house.offerprice - The offerprice for the house.
 * @param {string} house.location - The location of the house.
 * @param {string} house.imageURL - The imageurl of the house.
 * @param {boolean} house.underoffer - Is the house underoffer.
 * @param {boolean} house.highpriority - Is it high highpriority to sell.
 * @param {boolean} house.activated - archived or not.
 * @param {integer} house.userid - userid of the estage agent.
 * @returns {object} returns data related to the row created and id.
 */
exports.update = async function update (House) {
  try{
    const query = "UPDATE Houses SET ? WHERE houseid = ?;";
    const values = [House, House.houseid];
    const data = await db.run_query(query, values);
    return data;
  } catch(err){
    throw err
  }
}
/**
 * get  total count of houses in the database.
 * @function gettotalcount 
 * @returns {list} returns list where first element is the total count of houses.
 */
exports.gettotalcount = async function gettotalcount() {
  try{
    const query = "select COUNT(houseid) as totalhouse from Houses;";
    const data = await db.run_query(query);
    return data;    
  } catch (err){
    throw err
  }
}
