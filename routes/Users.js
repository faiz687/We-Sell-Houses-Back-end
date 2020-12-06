/**
 * A module containing all the routes (endpoints) for Users.
 * @module routes/Users
 * @author Faizaan Chowdhary
 * @requires koa-router
 * @requires koa-bodyparser
 * @requires /controllers/auth
 * @requires /models/Users
 * @requires /permissions/users
 * @requires /controllers/validation
 */
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

/**
 * The Route to get all Users on the database.
 * @function
 * @name GetAll {GET} /api/v1/users
 */
async function GetAll(ctx) {
  try {
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
  } catch(err) {
    ctx.status = 500;
    ctx.body = err
  }
}
/**
 * The Route to create the user in the database.
 * @function
 * @name CreateProperty {POST} /api/v1/users
 */
async function CreateUser(ctx) {
  try {    
    const body = ctx.request.body;
    if (body.signupcode !== "we_sell_houses_agent"){
      ctx.status = 400;
      ctx.body = { Err : "In-valid sign-up code" }
    } else {
      const result = await Model.add(body);
      if (result.affectedRows) {        
        const id = result.insertId;
        ctx.status = 201;
        ctx.body = {ID: id, created: true, link: `${ctx.request.path}/${id}`};
      }
    }
  } catch(err) {
    ctx.status = 500;
    ctx.body = err
  }
}
/**
 * The Route to create the user in the database.
 * @function
 * @name CreateProperty {POST} /api/v1/users/Login
 */
async function LoginUser(ctx) {  
  try {
    const { UserId  , username } =  ctx.state.user
    ctx.status = 200;
    ctx.body = { ID : UserId , Name : username   }
  } catch(err) {
    ctx.status = 500;
    ctx.body = err
  }
}
/**
 * The Route to get the specific user.
 * @function
 * @param {integer} id - Userid
 * @name getById {GET} /api/v1/users/:id
 */
async function GetUserById(ctx) {
  try {
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
  } catch(err) {
    ctx.status = 500;
    ctx.body = err
  }
}
/**
 * The Route to update the User by user id.
 * @function
 * @param {integer} id - the userid of the user to update.
 * @name updateProperty {PUT} /api/v1/users:id
 */
async function UpdateEstageAgent(ctx) {
  try {
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
  } catch(err) {
    ctx.status = 500;
    ctx.body = err
  }
}
/**
 * The Route to delete the specific user.
 * @function
 * @param {integer} id - the userid of the user to delete.
 * @name deleteProperty {DEL} /api/v1/users/:id
 */
async function DeleteEstateAgent(ctx) {
  try {
    const id = ctx.params.id;
    let result = await Model.getById(id);
    if (result.length) {
      const data = result[0];
      const permission = Can.delete(ctx.state.user, data);
      if (!permission.granted) {
        ctx.status = 403;
      } else {
        result = await Model.DeleteAgentByID(id);
        if (result.affectedRows) {
          ctx.status = 200;
          ctx.body = {ID: id, deleted: true}
        }
      }
    }
  } catch(err) {
    ctx.status = 500;
    ctx.body = err
  } 
}
/** All routes for User Router */
exports.UserRoutes =  module.exports = router;
