const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('september 2021 longest downtrend', async () => {
  const response = await api
    .get('/api/coins/bitcoin/market_chart/range?from=1630454400&to=1632960000&insights=true')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const trend = response.body.longest_downtrend
  expect(trend).toHaveProperty('found', true)
  expect(trend.start[0]).toBe(1632009600000)
  expect(trend.start[1]).toBeCloseTo(41162.4, 1)
  expect(trend.end[0]).toBe(1632268800000)
  expect(trend.end[1]).toBeCloseTo(34450.9, 1)
})

test('no downtrend between 4th and 8th of august 2021', async () => {
  const response = await api
    .get('/api/coins/bitcoin/market_chart/range?from=1628035200&to=1628380800&insights=true')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const trend = response.body.longest_downtrend
  expect(trend).toHaveProperty('found', false)    
})

test('if from == to, a single day should not have a downtrend', async () => {
  const response = await api
    .get('/api/coins/bitcoin/market_chart/range?from=1627776000&to=1627776000&insights=true')
    .expect(200)
    .expect('Content-Type', /application\/json/)
     
  const trend = response.body.longest_downtrend
  expect(trend).toHaveProperty('found', false)      
})

test('september 2021 max profit', async () => {
  const response = await api
    .get('/api/coins/bitcoin/market_chart/range?from=1630454400&to=1632960000&insights=true')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const maxProfit = response.body.max_profit
  expect(maxProfit).toHaveProperty('should_buy', true)
  expect(maxProfit.when_to_buy[0]).toBe(1630454400000)
  expect(maxProfit.when_to_sell[0]).toBe(1630972800000)
  expect(maxProfit.profit).toBeCloseTo(4345.5, 1)
})

test('no profit during a downtrend', async () => {
  const response = await api
    .get('/api/coins/bitcoin/market_chart/range?from=1632009600&to=1632268800&insights=true')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
  const maxProfit = response.body.max_profit
  expect(maxProfit).toHaveProperty('should_buy', false)  
})