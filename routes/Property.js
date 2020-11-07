const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const auth = require('../controllers/auth');

const property = require('../models/Property');
const features = require('../models/Feature');
// const articleViews = require('../models/articleViews');
// const articleCategories = require('../models/articleCategories');
// const comments = require('../models/comments');


const {validateProperty,  validatePropertyFeature } = require('../controllers/validation');

const prefix = '/api/v1/property';
const router = Router({prefix: prefix});

//property routes
// router.get('/', getAll);
router.post('/', auth, bodyParser(), validateProperty, createArticle);




// router.get('/:id([0-9]{1,})', getById);
// router.put('/:id([0-9]{1,})', auth, bodyParser(), validateArticle, updateArticle);
// router.del('/:id([0-9]{1,})', auth, deleteArticle);

// property feature  routes
// router.get('/:id([0-9]{1,})/likes', likesCount);
router.post('/:id([0-9]{1,})/features', auth , bodyParser(), validatePropertyFeature ,  addfeature);
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


// async function getAll(ctx) {
// 	console.log("hello world")
//   const {page=1, limit=100, order="dateCreated", direction='ASC'} = ctx.request.query;
//   const result = await articles.getAll(page, limit, order, direction);
//   if (result.length) {
//     const body = result.map(post => {
//       // extract the post fields we want to send back (summary details)
//       const {ID, title, summary, imageURL, authorID} = post;
//       // add links to the post summaries for HATEOAS compliance
//       // clients can follow these to find related resources
//       const links = {
//         likes: `${ctx.protocol}://${ctx.host}${prefix}/${post.ID}/likes`,
//         self: `${ctx.protocol}://${ctx.host}${prefix}/${post.ID}`
//       }
//       return {ID, title, summary, imageURL, authorID, links};
//     });
//     ctx.body = body;
//   }
// }

// async function likesCount(ctx) {
//   // TODO: add error handling
//   const id = ctx.params.id;
//   const result = await likes.count(id);
//   ctx.body = result ? result : 0;
// }

async function addfeature(ctx) {
  // TODO: add error handling
  const body = ctx.request.body;
  const id = parseInt(ctx.params.id);
  const result = await features.add(id, body);
  console.log(result);
  //ctx.body = result.affectedRows ? {message: "liked"} : {message: "error"};
}

// async function dislikePost(ctx) {
//   // TODO: remove error handling
//   const id = parseInt(ctx.params.id);
//   const uid = ctx.state.user.ID;
//   const result = await likes.dislike(id, uid);
//   console.log(result);
//   ctx.body = result.affectedRows ? {message: "disliked"} : {message: "error"};
// }

// async function getById(ctx) {
//   const id = ctx.params.id;
//   const result = await articles.getById(id);
//   if (result.length) {
//     await articleViews.add(id);  // add a record of being viewed
//     const article = result[0];
//     ctx.body = article;
//   }
// }

async function createArticle(ctx) {
  const body = ctx.request.body;
  const result = await property.add(body);
  if (result.affectedRows) {
    const id = result.insertId;
    ctx.status = 201;
    ctx.body = {ID: id, created: true, link: `${ctx.request.path}/${id}`};
  }
}

// async function updateArticle(ctx) {
//   const id = ctx.params.id;
//   let result = await articles.getById(id);  // check it exists
//   if (result.length) {
//     let article = result[0];
//     // exclude fields that should not be updated
//     const {ID, dateCreated, dateModified, authorID, ...body} = ctx.request.body;
//     // overwrite updatable fields with remaining body data
//     Object.assign(article, body);
//     result = await articles.update(article);
//     if (result.affectedRows) {
//       ctx.body = {ID: id, updated: true, link: ctx.request.path};
//     }
//   }
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
