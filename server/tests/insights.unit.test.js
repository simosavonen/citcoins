const insights = require('../utils/insights')

const testData1 = [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]]
const testData2 = [[1, 7], [2, 6], [3, 5], [4, 4], [5, 3], [6, 2], [7, 1]]
const testData3 = [[1, 4], [2, 3], [3, 2], [4, 1], [5, 5], [6, 6], [7, 3]]


test('longestDowntrend testData1, no downtrend', () => {
  const trend = insights.longestDowntrend(testData1).longest_downtrend
  expect(trend).toHaveProperty('found', false)
})

test('longestDowntrend testData2, one long downtrend', () => {
  const trend = insights.longestDowntrend(testData2).longest_downtrend
  expect(trend).toHaveProperty('found', true)
  expect(trend).toHaveProperty('start', [1, 7])
  expect(trend).toHaveProperty('end', [7, 1])
})

test('longestDowntrend testData3, two downtrends', () => {
  const trend = insights.longestDowntrend(testData3).longest_downtrend
  expect(trend).toHaveProperty('found', true)
  expect(trend).toHaveProperty('start', [1, 4])
  expect(trend).toHaveProperty('end', [4, 1])
})

test('maxProfit testData1, price keeps rising', () => {
  const profit = insights.maxProfit(testData1).max_profit
  expect(profit).toHaveProperty('should_buy', true)
  expect(profit).toHaveProperty('when_to_buy', [1, 1])
  expect(profit).toHaveProperty('when_to_sell', [7, 7])
  expect(profit).toHaveProperty('profit', 6)

})

test('maxProfit testData2, price keeps sinking', () => {
  const profit = insights.maxProfit(testData2).max_profit
  expect(profit).toHaveProperty('should_buy', false)
})

test('maxProfit testData3, price goes up on two days', () => {
  const profit = insights.maxProfit(testData3).max_profit
  expect(profit).toHaveProperty('should_buy', true)
  expect(profit).toHaveProperty('when_to_buy', [4, 1])
  expect(profit).toHaveProperty('when_to_sell', [6, 6])
  expect(profit).toHaveProperty('profit', 5)
})

test('maxVolume testData3', () => {
  const maxVolume = insights.maxVolume(testData3)
  expect(maxVolume).toHaveProperty('max_volume', [6, 6])
})