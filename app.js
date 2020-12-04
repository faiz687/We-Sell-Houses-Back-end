const Koa = require('koa');
const cors = require('@koa/cors');

const app = new Koa();

app.use(cors());

const users = require('./routes/Users.js');
const property = require('./routes/Property.js');


app.use(users.routes());
app.use(property.routes());

module.exports = app;
