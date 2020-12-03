const Router = require('koa-router');
const BodyParser = require('koa-bodyparser');
const Model = require('../models/Users');
const Auth = require('../controllers/auth');
const Can = require('../permissions/users');
const { ValidateUser, ValidateUserUpdate } = require('../controllers/validation');

const router = Router({prefix: '/api/v1/users'});

// User (estate agents) Routes
router.get('/' , Auth , GetAll);
router.post('/', BodyParser() , ValidateUser  , CreateUser);
router.post('/Login', Auth , BodyParser() , LoginUser);
router.get('/:id([0-9]{1,})', Auth, GetUserById);
router.put('/:id([0-9]{1,})', Auth, BodyParser(), ValidateUserUpdate, UpdateEstageAgent);
router.del('/:id([0-9]{1,})', Auth, DeleteEstateAgent );



async function GetAll(ctx) {
  const permission = Can.readAll(ctx.state.user);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    const result = await Model.getAll();
    if (result.length) {
      ctx.status = 200;
      ctx.body = result;
    }    
  }
}


async function CreateUser(ctx) {
  const body = ctx.request.body;
  const result = await Model.add(body);
  if (result.affectedRows) {
    const id = result.insertId;
    ctx.status = 201;
    ctx.body = {ID: id, created: true, link: `${ctx.request.path}/${id}`};
 }
}


async function LoginUser(ctx) {  
   const { UserId  , username  } =  ctx.state.user
   ctx.status = 200;
   ctx.body = { ID : UserId , Name : username   }
}


async function GetUserById(ctx) {
  const id = ctx.params.id;
  const result = await Model.getById(id);
  if (result.length) {
    const data = result[0]
    const permission = Can.read(ctx.state.user, data);
    if (!permission.granted) {
      ctx.status = 403;
    } else {
      ctx.status = 200;
      ctx.body = permission.filter(data);
    }
  }
}


async function UpdateEstageAgent(ctx) {
  const id = ctx.params.id;
  let result = await Model.getById(id); 
  if (result.length) {
    let data = result[0];
    const permission = Can.update(ctx.state.user, data);
    if (!permission.granted) {
      ctx.status = 403;
    } else {
      const UserDataToUpdate = permission.filter(ctx.request.body);
      Object.assign(UserDataToUpdate,{UserId: id});      
      result = await Model.update(UserDataToUpdate);
      if (result.affectedRows) {
        ctx.status = 200;
        ctx.body = {ID: id, updated: true, link: ctx.request.path};
      }
    }
  }
}

async function DeleteEstateAgent(ctx) {
  const id = ctx.params.id;
  let result = await Model.getById(id);
  if (result.length) {
    const data = result[0];
    const permission = Can.delete(ctx.state.user, data);
    if (!permission.granted) {
    } else {
      result = await Model.DeleteAgentByID(id);
      if (result.affectedRows) {
        ctx.statu = 200;
        ctx.body = {ID: id, deleted: true}
      }      
    }
  }
}

module.exports = router;
