/**
 * A module to perform CRUD operattion on the feature table.
 * @requires module:/helpers/database
 * @module models/Features
 * @author Faizaan Chowdhary
 */
const db = require('../helpers/database');
/**
 * Get feature by their id.
 * @function getById 
 * @param {integer} id of the feature.
 * @returns {list} returns list with the FeatureId , houseid and feature.
 */
exports.getById = async function getById (id) {
  try {
    const query = "SELECT * FROM Feature WHERE FeatureId = ?;";
    const values = [id];
    const data = await db.run_query(query, values);
    return data;    
  } catch(err) {    
    throw err
  }
}
/**
 * Get feature by their house-id.
 * @function getfeatureByhouseId 
 * @param {integer} house-id .
 * @returns {list} returns list of all features with house-id.
 */
exports.getfeatureByhouseId = async function getByhouseId (id) {
  try {
    const query = "SELECT * FROM Feature WHERE houseid = ?;";
    const values = [id];
    const data = await db.run_query(query, values);
    return data;        
  } catch (err) {
    throw err
  } 
}
/**
 * List all the features in the table
 * get the user by their username
 * @function getAll 
 * @returns {list} returns a list with all the users in users table.
 */
exports.getAllfeatures = async function getAll () {
  try{
    const query = "SELECT * FROM Feature;";
    const data = await db.run_query(query);
    return data;
  } catch (err) {
    throw err
  }
}
/**
 * add all the features for the house created.
 * @function add 
 * @param {integer} houseid - The id of the house.
 * @param {list} Allfeature - All the features of the house .
 * @returns {object} returns data related to the row affected and id.
 */
exports.add = async function add(houseid,Allfeature) {
  try {
    Allfeature.forEach( async (item, index) => {
    const query = "INSERT INTO Feature SET ?";
    const feature = {houseid:houseid , feature:item }
    const data = await db.run_query(query, feature);
    return data;
    })    
  } catch (err) {
    throw err
  }   
}
/**
 * Delete all house feature by its  house-id
 * @function delById 
 * @param {integer} id of the house.
 * @returns {object} returns data related to the row affected.
 */
exports.delById = async function delById (id) {
  try {
    const query = "DELETE FROM Feature WHERE houseid = ?;";
    const values = [id];
    const data = await db.run_query(query, values);
    return data;     
  } catch (err) {
    throw err
  }
}
/**
 * Update an existing feature by its id
 * @function update 
 * @param {Object} feature - The feature to be updated.
 * @param {integer} feature.id - The feature id.
 * @returns {object} returns data related to the row affected and id.
 */
exports.update = async function update (feature) {
  try {
    const query = "UPDATE Feature SET  ? WHERE FeatureId = ?;";
    const values = [feature, feature.ID];
    const data = await db.run_query(query, values);
    return data;    
  } catch (err) {      
    throw err
  }
}
