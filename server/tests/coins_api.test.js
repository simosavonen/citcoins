const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('list of supported coins is returned as json', async () => {
  await api
    .get('/api/coins/list')
    .expect(200)
    .expect('Content-Type', /application\/json/)

})

test('unsupported coin returns an error', async () => {
  await api
    .get('/api/coins/ethereum')
    .expect(404)
    .expect({ 'error': 'unsupported cryptocurrency' })
})

test('unknown endpoint returns an error', async () => {
  await api
    .get('/api/crypto')
    .expect(404)
    .expect({ 'error': 'unknown endpoint' })
})

test('ethereum/market_chart returns an error', async () => {
  await api
    .get('/api/coins/ethereum/market_chart')
    .expect(404)
    .expect({ 'error': 'unsupported cryptocurrency' })
})

test('bitcoin/market_chart returns 200', async () => {
  await api
    .get('/api/coins/bitcoin/market_chart')
    .expect(200)
    
})