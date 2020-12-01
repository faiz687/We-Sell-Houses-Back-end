const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/Users');
const auth = require('../controllers/auth');
const {validateUser, validateUserUpdate} = require('../controllers/validation');

const router = Router({prefix: '/api/v1/users'});

// router.get('/' ,  auth , getAll);
router.post('/', bodyParser() ,  createUser);
router.post('/Login', bodyParser() , LoginUser);
// router.put('/:id([0-9]{1,})', auth, bodyParser(), validateUserUpdate, updateUser);
// router.del('/:id([0-9]{1,})', auth, deleteUser);

async function getById(ctx) {
  const id =  ctx.params.id;
  const result = await model.getById(id);
  if (result.length) {
    const data = result[0]
    const permission = can.read(ctx.state.user, data);
    if (!permission.granted) {
      ctx.status = 403;
    } else {
      ctx.body = permission.filter(data);
    }
  }
}


async function createUser(ctx) {
  const body = ctx.request.body;
  const result = await model.add(body);
  if (result.affectedRows) {
    const id = result.insertId;
    ctx.status = 201;
    ctx.body = {ID: id, created: true, link: `${ctx.request.path}/${id}`};
 }
}

async function LoginUser(ctx) {  
   console.log("direct")
   const { UserId  , username  } =  ctx.state.user
   console.log(UserId,username)
//   
//   ctx.status = 200;
//   ctx.body = { ID : UserId , Name : username   }
}

// async function updateUser(ctx) {
//   const id = ctx.params.id;
//   let result = await model.getById(id);  // check it exists
//   if (result.length) {
//     let data = result[0];
//     const permission = can.update(ctx.state.user, data);
//     if (!permission.granted) {
//       ctx.status = 403;
//     } else {
//       // exclude fields that should not be updated
//       const newData = permission.filter(ctx.request.body);
//       Object.assign(newData, {ID: id}); // overwrite updatable fields with body data
//       result = await model.update(newData);
//       if (result.affectedRows) {
//         ctx.body = {ID: id, updated: true, link: ctx.request.path};
//       }
//     }
//   }
// }

// async function deleteUser(ctx) {
//   const id = ctx.params.id;
//   let result = await model.getById(id);
//   if (result.length) {
//     const data = result[0];
//     console.log("trying to delete", data);
//     const permission = can.delete(ctx.state.user, data);
//     if (!permission.granted) {
//       ctx.status = 403;
//     } else {
//       result = await model.delById(id);
//       if (result.affectedRows) {
//         ctx.body = {ID: id, deleted: true}
//       }      
//     }
//   }
// }

module.exports = router;
