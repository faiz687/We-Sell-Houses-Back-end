const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const auth = require('../controllers/auth');
const property = require('../models/Property');
const features = require('../models/Feature');
const {  ValidateProperty , validatePropertyFeature } = require('../controllers/validation');
const prefix = '/api/v1/property';
const router = Router({prefix: prefix});


//property routes
router.get('/',getAll);
router.get('/TotalProperty' , getpropertyCount);
router.post('/', auth, bodyParser(), ValidateProperty , CreateProperty);
router.put('/:id([0-9]{1,})', auth, bodyParser(), ValidateProperty, updateProperty);
router.get('/:id([0-9]{1,})', getById);
router.del('/:id([0-9]{1,})', auth, deleteProperty);

async function getAll(ctx) {
  try {    
    let { page=1, limit=100, order="dateCreated", direction='ASC' } = ctx.request.query;
    
    //ensuring all parameters are in their correct format and check if sensible values have been reuqyested.
    limit = parseInt(limit);
    page = parseInt(page);
    
    limit = limit > 100 ? 100 : limit;
    limit = limit < 1 ? 10 : limit;    
    page = page < 1 ? 1 : page;
    
    order = ['dateCreated', 'dateModified'].includes(order) ? order : 'dateCreated';
    direction = ['ASC', 'DESC'].includes(direction) ? direction : 'ASC';
    
    const result = await property.getAll(page, limit, order, direction);
    if (result.length) {
      const body = result.map(post => {
      const  { houseid, title, imageURL, category , offerprice , UserId , dateCreated} = post;
      return { houseid, title, imageURL, category , offerprice , UserId , dateCreated}
      });
      ctx.body = body;
    }
  } catch (err) {        
    ctx.status = 500;
    ctx.body = err
  }
}

async function getpropertyCount(ctx) {
  try {
    const result = await property.gettotalcount();
    if (result.length) {
      const HousesCount = result[0];
      ctx.status = 200;
      ctx.body = HousesCount;
    } 
  } catch(err) {
    ctx.status = 500;
    ctx.body = err
  } 
}

async function CreateProperty(ctx) {  
  try {
    const body = ctx.request.body;
    const housefeatures = body.feature
    delete body.feature;
    const result = await property.add(body);
    if (housefeatures.length > 0){
      await features.add(result.insertId, housefeatures);
    }
    if (result.affectedRows) {
      const id = result.insertId;
      ctx.status = 201;
      ctx.body = { ID: id , created: true, link: `${ctx.request.path}/${id}`};
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = err
  }
}

async function updateProperty(ctx) {
  try {
    const id = ctx.params.id;
    let result = await property.getById(id);
    if (result.length) {
      let house = result[0];
      const { houseid , dateCreated ,  ...body } = ctx.request.body;
      Object.assign(house, body);
      const  { feature }  = house 
      delete house.feature;
      result = await property.update(house);        
      if (result.affectedRows) {
        if (feature.length > 0) {
          await features.delById(id);
          await features.add(id, feature);
        }
        ctx.body = {ID: id, updated: true, link: ctx.request.path};
      }
    }
  } catch (err) {
  ctx.status = 500;
  ctx.body = err
  }
}
  
async function getById(ctx) {
  try {
    const id = ctx.params.id;
    const result = await property.getById(id);
    if (result.length) {
      const property = result[0];
      ctx.body = property;
    }
  } catch (err) {
  ctx.status = 500;
  ctx.body = err
  }
}

async function deleteProperty(ctx) {
  try {
    const id = ctx.params.id;
    const result = await property.delById(id);  
    if (result.affectedRows) {
      await features.delById(id);
      ctx.body = {ID: id, deleted: true}
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = err
  }
}

module.exports = router;
