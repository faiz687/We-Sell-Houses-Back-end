/**
 * A module to run JSON Schema based validation on request/response data.
 * @module controllers/validation
 * @author Faizaan Chowdhary
 * @see schemas/* for JSON Schema definition files
 */
const {Validator, ValidationError} = require('jsonschema');
const userSchema = require('../schemas/User.json').definitions.user;
const propertySchema = require('../schemas/Property.json').definitions.property;
const UserUpdateSchema = require('../schemas/User.json').definitions.userUpdate;
/**
 * Wrapper that returns a Koa middleware validator for a given schema.
 * @param {object} schema - The JSON schema definition of the resource
 * @param {string} resource - The name of the resource e.g. 'property'
 * @returns {function} - A Koa middleware handler taking (ctx, next) params
 */
const makeKoaValidator = (schema, resource) => {
  const v = new Validator();
  const validationOptions = {
    throwError: true,
    propertyName: resource
  };  
  /**
   * Koa middleware handler function to do validation
   * @param {object} ctx - The Koa request/response context object
   * @param {function} next - The Koa next callback
   * @throws {ValidationError} a jsonschema library exception
   */
  const handler = async (ctx, next) => {

    const body = ctx.request.body;

    try {
      v.validate(body, schema, validationOptions);
      await next();
    } catch (error) {
      if (error instanceof ValidationError) {
        ctx.status = 400
        ctx.body = error;
      } else {
        throw error;
      }
    }
  }
  return handler;
}

/** Validate data against user schema for creating new users */
exports.ValidateUser = makeKoaValidator(userSchema, 'user');
/** Validate data against property schema */
exports.ValidateProperty = makeKoaValidator(propertySchema, 'property');
/** Validate data against the user schema for updating existing estatet agensts on to the system */
exports.ValidateUserUpdate = makeKoaValidator(UserUpdateSchema, 'userUpdate');
