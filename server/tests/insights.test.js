const supertest = require('supertest')
const app = require('../app')
const insights = require('../utils/insights')

const api = supertest(app)

const testData1 = [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]]
const testData2 = [[1, 7], [2, 6], [3, 5], [4, 4], [5, 3], [6, 2], [7, 1]]
const testData3 = [[1, 4], [2, 3], [3, 2], [4, 1], [5, 5], [6, 6], [7, 3]]

test('testData1, no downtrend', () => {
  const trend = insights.longestDowntrend(testData1)
  expect(trend.longest_downtrend).toHaveProperty('found', false)
})

test('testData2, one long downtrend', () => {
  const trend = insights.longestDowntrend(testData2)
  expect(trend.longest_downtrend).toHaveProperty('found', true)
  expect(trend.longest_downtrend.start).toStrictEqual([1, 7])
  expect(trend.longest_downtrend.end).toStrictEqual([7, 1])
})

test('testData3, two downtrends', () => {
  const trend = insights.longestDowntrend(testData3)
  expect(trend.longest_downtrend).toHaveProperty('found', true)
  expect(trend.longest_downtrend.start).toStrictEqual([1, 4])
  expect(trend.longest_downtrend.end).toStrictEqual([4, 1])
})



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