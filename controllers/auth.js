/**
 * A module to set up passport and its authentication stratergies.Importing this module 
 * in a route gives a middleware handler that can be used to protect downstream handlers by rejecting unauthenticated requests.
 * @module controllers/auth
 * @author Faizaan Chowdhary
 * @see strategies/basic* for all the stratergies.
 */
const passport = require('koa-passport');
const basicAuth = require('../strategies/basic');

passport.use(basicAuth);

/** Authenticating the client by their username and password  */
module.exports = passport.authenticate(['basic'], {session:false});
