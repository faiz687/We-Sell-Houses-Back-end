/**
 * A module containing all the test functions for property endpoints.
 * @module __tests__/Property_Routes
 * @author Faizaan Chowdhary
 * @requires supertest
 * @requires /app
 */
const request = require('supertest')
const app = require('../app')
let houseid =  0

describe('TESTING : Get all Houses ', () => { 
  it('Should Return Status Code : 200', async () => {
      const res = await request(app.callback()).get('/api/v1/property')
      expect(res.statusCode).toEqual(200)
    })
});

describe('TESTING : Create a Property', () => { 
  it('Should Return Status Code : 201 AND Created = true' , async () => {
    const res = await request(app.callback()).post('/api/v1/property')
    .auth('ethanhunt21', 'ethanhunt21').send({
    "Title": "House 200",
    "description": "House 200 is a good house with all the amenities",
    "category": "Apartment",
    "offerprice": 1200,
    "location": "Coventry , West Midlands",
    "imageURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAA",
    "underoffer": true,
    "highpriority": true,
    "UserId": 5,
    "Activated": true,
    "feature": ["Parking","garden","terrace"]
    })
   expect(res.statusCode).toEqual(201)
   expect(res.body).toHaveProperty('created',true)
   houseid =  res.body.ID
  })
    });

describe('TESTING : Create a Property : Validation Error', () => { 
  it('Should Return Status Code : 400' , async () => {
    const res = await request(app.callback()).post('/api/v1/property')
    .auth('faizaan', 'faizaan').send({
    "description": "House 200 is a good house with all the amenities",
    "category": "Apartment",
    "offerprice": 1200,
    "location": "Coventry , West Midlands",
    "imageURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAA",
    "underoffer": true,
    "highpriority": true,
    "UserId": 1,
    "Activated": true,
    "feature": ["Parking","garden","terrace"]
    })
   expect(res.statusCode).toEqual(400)
  })
    });

describe('TESTING : Get House by id', () => { 
   
  it('Should Return Status Code : 200 AND ID ', async () => {
      const res = await request(app.callback()).get('/api/v1/property/'+houseid)
expect(res.statusCode).toEqual(200)
expect(res.body.houseid).toBe(houseid)}
   )});

describe('TESTING : Get House by id : No Content', () => { 
  it('Should Return Status Code : 204 ', async () => {
      const res = await request(app.callback()).get('/api/v1/property/500')
expect(res.statusCode).toEqual(204)}
    )});

describe('TESTING : Update a Property', () => { 
   
  it('Should Return Status Code : 200 AND Updated = true', async () => {
    const res = await request(app.callback()).put('/api/v1/property/'+houseid)
    .auth('ethanhunt21', 'ethanhunt21').send({
    "Title": "House 202", //update house title
    "description": "House 200 is a good house with all the amenities",
    "category": "Apartment",
    "offerprice": 1200,
    "location": "Coventry , West Midlands",
    "underoffer": true,
    "highpriority": true,
    "feature": ["Parking","garden","terrace"]
    })
   expect(res.statusCode).toEqual(200)
   expect(res.body).toHaveProperty('updated',true)
  })
});

describe('TESTING : Update a Property : Validation Error', () => { 
    
  it('Should Return Status Code : 400 AND Created = true', async () => {
    const res = await request(app.callback()).put('/api/v1/property/'+houseid)
    .auth('ethanhunt21', 'ethanhunt21').send({
    "description": "House 200 is a good house with all the amenities",
    "category": "Apartment",
    "offerprice": 1200,
    "location": "Coventry , West Midlands",
    "underoffer": true,
    "highpriority": true,
    "Activated": true,
    "feature": ["Parking","garden","terrace"]
    })
   expect(res.statusCode).toEqual(400)
  })
});

describe('TESTING : Update a Property : Permission Denied ', () => { 
    
  it('Should Return Status Code : 403 ', async () => {
    const res = await request(app.callback()).put('/api/v1/property/'+houseid)
    .auth('faizaan', 'faizaan').send({
    "Title": "House 202", //update house title
    "description": "House 200 is a good house with all the amenities",
    "category": "Apartment",
    "offerprice": 1200,
    "location": "Coventry , West Midlands",
    "underoffer": true,
    "highpriority": true,
    "feature": ["Parking","garden","terrace"]
    })
   expect(res.statusCode).toEqual(403)
  })
});

describe('TESTING : Delete a Property : Permission Denied ', () => { 
    
  it('Should Return Status Code : 403 ', async () => {
    const res = await request(app.callback()).del('/api/v1/property/'+houseid)
    .auth('ethanhunt21', 'ethanhunt21')
   expect(res.statusCode).toEqual(403)
  })
});

describe('TESTING : Delete a Property ', () => { 
    
  it('Should Return Status Code : 403 ', async () => {
    const res = await request(app.callback()).del('/api/v1/property/'+houseid)
    .auth('faizaan', 'faizaan')
   expect(res.statusCode).toEqual(200)
   expect(res.body).toHaveProperty('deleted',true)
  })
});