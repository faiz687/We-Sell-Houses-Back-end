/**
 * A module containing all the test functions for users endpoints.
 * @module __tests__/user_Routes
 * @author Faizaan Chowdhary
 * @requires supertest
 * @requires /app
 */
const request = require('supertest')
const app = require('../app')
let Userid = 0

describe('Get all Users ', () => { 
  it('Should Return Status Code : 200', async () => {
      const res = await request(app.callback()).get('/api/v1/users').auth('faizaan', 'faizaan')
      expect(res.body).toBeTruthy();
      expect(res.statusCode).toEqual(200);  
    })
});

describe('TESTING : Get all Users : Permision Denied ', () => { 
  it('Should Return Status Code : 403', async () => {
      const res = await request(app.callback()).get('/api/v1/users').auth('ethanhunt', 'ethanhunt')
      expect(res.statusCode).toEqual(403);  
    })
});

describe('TESTING : Create a new user', () => { 
  it('Should Return Status Code : 201 AND Created = true', async () => {
      const res = await request(app.callback()).post('/api/v1/users').send({
      username: 'unique_1122335',
      password: 'password',
      email: 'unique_email@example.com',
      signupcode: 'we_sell_houses_agent'
      })
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('created', true)
      Userid = res.body.ID
  })
});

describe('TESTING : Create a new user : Validation Error', () => { 
  it('Should Return Status Code : 400', async () => {
      const res = await request(app.callback()).post('/api/v1/users').send({
      
      password: 'password',
      email: 'unique_email@example.com',
      signupcode: 'we_sell_houses_agent'
      })
      expect(res.statusCode).toEqual(400)})});

describe('TESTING : Create a new user : Invalid Signup Code', () => { 
  it('Should Return Status Code : 400', async () => {
      const res = await request(app.callback()).post('/api/v1/users').send({
      username: 'unique_1122335',
      password: 'password',
      email: 'unique_email@example.com',
      signupcode: 'we_houses_agent'
      })
      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('Err', "In-valid sign-up code")
  })});

describe('TESTING : Login user', () => {   
  it('Should Return Status Code : 200 AND ID of User', async () => {
      const res = await request(app.callback()).post('/api/v1/users/Login')
      .auth('unique_1122335', 'password')
      expect(res.statusCode).toEqual(200)
      expect(res.body.ID).toBe(Userid)
  })  
});

describe('TESTING : Login user : Authentication Denied', () => { 
  it('Should Return Status Code : 401', async () => {
      const res = await request(app.callback()).post('/api/v1/users/Login')
      .auth('example', 'example')
      expect(res.statusCode).toEqual(401);
    })
});

describe('TESTING : Login user : INVALID ', () => { 
    
  it('Should Return Status Code : 403 ', async () => {
      const res = await request(app.callback()).post('/api/v1/users/Login')
      .auth('unique_1122335', 'password12') // incorrect password
      expect(res.statusCode).toEqual(401)
  })
  
});

describe('TESTING : Get User By Id', () => { 
  it('Should Return Status Code : 200', async () => {
      const res = await request(app.callback()).get('/api/v1/users/'+Userid)
      .auth('unique_1122335', 'password')
      expect(res.body).toHaveProperty('UserId', Userid)
      expect(res.statusCode).toEqual(200);
    })
});

describe('TESTING : Get User By Id : Permision Denied', () => { 
  it('Should Return Status Code : 403', async () => {
      const res = await request(app.callback()).get('/api/v1/users/'+Userid)
      .auth('ethanhunt21', 'ethanhunt21')
      expect(res.statusCode).toEqual(403);
    })
});

describe('TESTING : Get User By Id : Authentication Denied', () => { 
  it('Should Return Status Code : 401', async () => {
      const res = await request(app.callback()).get('/api/v1/users/'+Userid)
      .auth('example', 'example')
      expect(res.statusCode).toEqual(401);
    })
});



