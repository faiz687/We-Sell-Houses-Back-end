/**
 * @file We sell houses OpenAPI Documentation Server
 * @author faizaan chowdhary
 * @version v1
 * @description This file initialises the Documentation server and mounts its static paths.
 */
const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');
const app = new Koa();

app.use(mount('/', serve('./docs/jsdocs')))
app.use(mount('/openapi', serve('./docs/openapi')))
app.use(mount('/schemas', serve('./schemas')))

let port = process.env.PORT || 3030;

app.listen(port);
console.log(`OpenAPI server running on port ${port}`)
