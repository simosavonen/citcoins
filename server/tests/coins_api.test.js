const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('list of supported coins is returned as json', async () => {
  await api
    .get('/coins/list')
    .expect(200)
    .expect('Content-Type', /application\/json/)

})

test('unsupported coin returns an error', async () => {
  await api
    .get('/coins/ethereum')
    .expect(404)
})