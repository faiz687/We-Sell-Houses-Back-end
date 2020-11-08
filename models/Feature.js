const db = require('../helpers/database');

//get a single article by its id  
exports.getById = async function getById (id) {
  const query = "SELECT * FROM articles WHERE ID = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}

//list all the articles in the database
exports.getAll = async function getAll ( page, limit, order, direction) {
  const offset = (page - 1) * limit;
  let query;
  if (direction === 'DESC') {
    query = "SELECT * FROM articles ORDER BY ?? DESC LIMIT ? OFFSET ?;";
  } else {
    query = "SELECT * FROM articles ORDER BY ?? ASC LIMIT ? OFFSET ?;";    
  }
  const values = [order, parseInt(limit), parseInt(offset)];
  const data = await db.run_query(query, values);
  return data;
}

//create a new feature in the database
exports.add = async function add(houseid,Allfeature) {
    Allfeature.forEach( async (item, index) => {
    const query = "INSERT INTO Feature SET ?";
    const feature = {houseid:houseid , feature:item }
    const data = await db.run_query(query, feature);
    return data;
   
  })
}

//delete all feature by house id
exports.delById = async function delById (id) {
  const query = "DELETE FROM Feature WHERE houseid = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}

//update an existing article
exports.update = async function update (article) {
  const query = "UPDATE articles SET ? WHERE ID = ?;";
  const values = [article, article.ID];
  const data = await db.run_query(query, values);
  return data;
}