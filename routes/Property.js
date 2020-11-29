const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const fs = require('fs-extra');
const auth = require('../controllers/auth');
const property = require('../models/Property');
const features = require('../models/Feature');

const {validateProperty,  validatePropertyFeature } = require('../controllers/validation');
const prefix = '/api/v1/property';
const router = Router({prefix: prefix});


//property routes
router.get('/' , getAll);
router.get('/TotalProperty' , getpropertyCount);
router.post('/' , auth, bodyParser(), CreateProperty);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateProperty, updateProperty);
router.get('/:id([0-9]{1,})', getById);
router.del('/:id([0-9]{1,})', auth, deleteProperty);

async function getAll(ctx) {
  const {page=1, limit=100, order="dateCreated", direction='ASC'} = ctx.request.query;
  const result = await property.getAll(page, limit, order, direction);
  if (result.length) {
    const body = result.map(post => {
      // extract the post fields we want to send back (summary details)
      const  { houseid, title, imageURL, category , offerprice , UserId , dateCreated} = post;
      return { houseid, title, imageURL, category , offerprice , UserId , dateCreated}
    }); 
    ctx.body = body;
  }
}

async function CreateProperty(ctx) {
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
    ctx.body = {ID: id, created: true, link: `${ctx.request.path}/${id}`};
  }
}

async function updateProperty(ctx) {
  const id = ctx.params.id;
  let result = await property.getById(id);
  if (result.length) {
    let house = result[0];
    const {houseid , dateCreated ,  ...body} = ctx.request.body;
    Object.assign(house, body);
    const {feature} = house
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
}

async function getById(ctx) {
  const id = ctx.params.id;
  const result = await property.getById(id);
  if (result.length) {
    const property = result[0];
    ctx.body = property;
  }
}

async function deleteProperty(ctx) {
  const id = ctx.params.id;
  const result = await property.delById(id);  
  if (result.affectedRows) {
    await features.delById(id);
    ctx.body = {ID: id, deleted: true}
  }
}

async function getpropertyCount(ctx) {
  try {
    const result = await property.gettotalcount();
     ctx.status = 200 
     ctx.body = { TotalHouses: result};  
  } catch(err) {
    console.log(err)
  } 
}



// router.get('/:id([0-9]{1,})', getById);
// router.put('/:id([0-9]{1,})', auth, bodyParser(), validateArticle, updateArticle);
// router.del('/:id([0-9]{1,})', auth, deleteArticle);

// property feature  routes
// router.get('/:id([0-9]{1,})/likes', likesCount);
// router.del('/:id([0-9]{1,})/likes', auth, dislikePost);

// // views route
// router.get('/:id([0-9]{1,})/views', getViewCount);

// // categories routes
// router.get('/:id([0-9]{1,})/categories', getAllCategories);
// router.post('/:id([0-9]{1,})/categories/:cid([0-9]{1,})', auth, addCategory);
// router.del('/:id([0-9]{1,})/categories/:cid([0-9]{1,})', auth, removeCategory);

// // comments routes
// router.get('/:id([0-9]{1,})/comments', getAllComments);
// router.post('/:id([0-9]{1,})/comments', auth, bodyParser(), addCommentIds, validateComment, addComment);


// async function addfeature(ctx) {
//   // TODO: add error handling
//   const body = ctx.request.body;
//   const id = parseInt(ctx.params.id);
//   const result = await features.add(id, body);
//   console.log(result);
//   //ctx.body = result.affectedRows ? {message: "liked"} : {message: "error"};
// }

// async function dislikePost(ctx) {
//   // TODO: remove error handling
//   const id = parseInt(ctx.params.id);
//   const uid = ctx.state.user.ID;
//   const result = await likes.dislike(id, uid);
//   console.log(result);
//   ctx.body = result.affectedRows ? {message: "disliked"} : {message: "error"};
// }


// async function deleteArticle(ctx) {
//   const id = ctx.params.id;
//   const result = await articles.delById(id);
//   if (result.affectedRows) {
//     ctx.body = {ID: id, deleted: true}
//   }
// }

// async function getViewCount(ctx) {                         
//   const id = ctx.params.id;
//   const result = await articleViews.count(id);
//   if (result.length) {
//     ctx.body = {ID: id, views: result[0].views};
//   }
// }

// async function addCategory(ctx) {
//   const articleID = ctx.params.id;
//   const categoryID = ctx.params.cid;
//   const result = await articleCategories.add(articleID, categoryID);
//   if (result.affectedRows) {
//     ctx.status = 201;
//     ctx.body = {added: true};
//   }
// }

// async function removeCategory(ctx) {
//   const articleID = ctx.params.id;
//   const categoryID = ctx.params.cid;
//   const result = await articleCategories.delete(articleID, categoryID);
//   if (result.affectedRows) {
//     ctx.body = {deleted: true};
//   }
// }

// async function getAllCategories(ctx) {
//   const id = ctx.params.id;
//   const result = await articleCategories.getAll(id);
//   if (result.length) {
//     ctx.body = result;
//   }
// }

// async function getAllComments(ctx) {
//   const id = ctx.params.id;
//   const result = await comments.getAll(id);
//   if (result.length) {
//     ctx.body = result;
//   }
// }

// async function addComment(ctx) {
//   const comment = ctx.request.body;
//   const result = await comments.add(comment);
//   if (result.affectedRows) {
//     const id = result.insertId;
//     ctx.status = 201;
//     ctx.body = {ID: id, created: true};
//   }
// }

// function addCommentIds(ctx, next) {
//   // every comment needs an article ID and a user ID
//   const id = parseInt(ctx.params.id);
//   const uid = ctx.state.user.ID;
//   Object.assign(ctx.request.body, {articleID: id, authorID: uid})
//   return next();
// }

module.exports = router;
