const Koa = require('koa');
const cors = require('@koa/cors');
const app = new Koa();

app.use(cors());

const users = require('./routes/Users.js');

app.use(users.routes());

let port = process.env.PORT || 8000;

app.listen(port);
console.log(`API server running on port ${port}`)