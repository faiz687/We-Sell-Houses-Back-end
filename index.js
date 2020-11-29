const Koa = require('koa');
const cors = require('@koa/cors');
const serve = require('koa-static');

const app = new Koa();

app.use(cors());

const users = require('./routes/Users.js');
const property = require('./routes/Property.js');


app.use(serve('HouseImages'));
app.use(users.routes());
app.use(property.routes());

let port = process.env.PORT || 8000;

app.listen(port);
console.log(`API server running on port ${port}`)