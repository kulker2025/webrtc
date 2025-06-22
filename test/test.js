const supertest = require('supertest')

describe('GET /api/users', () => {

    const host = 'http://localhost:8000/api' 
    const restype= 'application/json; charset=utf-8'
    var token = null

    it('post /register ', function(done) {
      supertest(host)
        .post('/register')
        .set('Accept', 'application/json')
        .send({
            name: 'mari',
            email: 'mari@zold.lan',
            password: 'titok',
            password_confirmation: 'titok'
        })
        .expect('Content-Type', restype)
        .expect(201, done)
    })
    it('post /login ', (done) => {
      supertest(host)
        .post('/login')
        .set('Accept', 'application/json')
        .send({
            name: 'mari',
            password: 'titok'
        })
        .expect('Content-Type', restype)
        .expect(200, done)
        .expect(res => {
          token = res.body.accessToken
        })
    })
    it('get /users ', function(done) {
      supertest(host)
        .get('/users')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(200, done)
    })
  })