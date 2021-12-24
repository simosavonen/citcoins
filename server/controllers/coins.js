const express = require('express')
const router = express.Router()
const config = require('../utils/config')
const insights = require('../utils/insights')
const fetch = require('node-fetch')


const unsupportedCoinError = (req, res) => {  
  if(config.COINS.some(c => c.id !== req.params.id)) {
    res.status(404).json({
      'error': 'unsupported cryptocurrency'
    })
    return true    
  }
  return false
}

const invalidTimestampsError = (req, res) => {
  const from = parseInt(req.query.from)
  const to = parseInt(req.query.to)
  if(from >= to) {
    res.status(400).send({ 
      'error': 'invalid timestamps',
      'from': 'required query parameter, unix timestamp',
      'to': 'required query parameter, unix timestamp',
      'detail': 'the timestamps need to be in chronological order'
    })
    return true
  } 
  return false
  
}

router.get('/', (req, res) => {
  res.status(200).json({
    '_links': {
      'list': {
        'href': '/list'
      },
    }
  })
})

// lists the supported cryptocurrencies
router.get('/list', (req, res) => {
  res.status(200).json(config.COINS)
})

router.get('/:id', (req, res) => {
  if(unsupportedCoinError(req, res)) return

  const coin = config.COINS.filter(c => c.id === req.params.id)

  res.status(200).json({
    ...coin[0],
    '_links': {
      'market_chart': {
        'href': '/market_chart'
      }
    }
  })    
})

router.get('/:id/market_chart', async (req, res) => {
  if(unsupportedCoinError(req, res)) return

  const api_url = `https://api.coingecko.com/api/v3/coins/${req.params.id}/market_chart`
  const options = '?vs_currency=eur&days=100'

  const response = await fetch(api_url + options)
  let data = await response.json()

  // data = {'prices': [[unix timestamp, price], ...],
  // 'market_caps': [[unix timestamp, market cap], ...],
  // 'total_volumes': [[unix timestamp, total volume], ...]}

  const max_volume = insights.maxVolume(data.total_volumes)
   
  // todo: only add these if user asked for them
  const trend = insights.longestDowntrend(data.prices)

  // filter the date range prior to giving it as an argument
  const max_profit = insights.maxProfit(data.prices)
    
  res.status(200).json({
    ...data,
    ...trend,
    ...max_profit,
    ...max_volume,
    '_links': {
      'range': {
        'href': '/range'
      }
    }
  })    
})

router.get('/:id/market_chart/range', async (req, res) => {
  if(unsupportedCoinError(req, res)) return
  if(invalidTimestampsError(req, res)) return

  let from = parseInt(req.query.from)
  let to = parseInt(req.query.to) + 60*60

  const api_url = `https://api.coingecko.com/api/v3/coins/${req.params.id}/market_chart/range`
  let options = `?vs_currency=eur&from=${from}&to=${to}`

  // for this assigment, force coingecko to return daily data
  // by ensuring we always ask data for at least 91 days
  const ninetyoneDays = 60*60*24*91
  if(to - from < ninetyoneDays) {
    options = `?vs_currency=eur&from=${to - ninetyoneDays}&to=${to}`
  } 

  const response = await fetch(api_url + options)
  let data = await response.json()  

  // data has the timestamps in milliseconds
  const fromInMs = from * 1000
  const toInMs = to * 1000

  // return to user only the portion of the data they asked for
  data = {
    'prices': data.prices.filter(price => fromInMs <= price[0] && price[0] <= toInMs),
    'market_caps': data.market_caps.filter(cap => fromInMs <= cap[0] && cap[0] <= toInMs),
    'total_volumes': data.total_volumes.filter(vol => fromInMs <= vol[0] && vol[0] <= toInMs)
  }
  
  res.status(200).json(data)
})

module.exports = router