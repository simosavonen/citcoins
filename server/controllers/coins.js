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

const unsupportedFiatError = (req, res) => {
  if(req.query.vs_currency !== undefined) {
    if(config.FIAT.some(f => f.id !== req.query.vs_currency)) {
      res.status(404).json({
        'error': 'unsupported fiat currency'
      })
      return true
    }
  }
  return false
}

const invalidTimestampsError = (req, res) => {
  const from = parseInt(req.query.from)
  const to = parseInt(req.query.to)
  if(from > to || to > Math.round(+new Date()/1000)) {
    res.status(400).send({ 
      'error': 'invalid timestamps',
      'from': 'required query parameter, unix timestamp in seconds',
      'to': 'required query parameter, unix timestamp in seconds',
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

// lists the supported crypto and fiat currencies
router.get('/list', (req, res) => {
  res.status(200).json({ 
    'supported_cryptocurrencies': config.COINS,
    'supported_fiat': config.FIAT
  })
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
  if(unsupportedFiatError(req, res)) return

  const fiat = req.query.vs_currency === undefined ? 'eur' : req.query.vs_currency

  const api_url = `https://api.coingecko.com/api/v3/coins/${req.params.id}/market_chart`
  const options = `?vs_currency=${fiat}&days=100`

  const response = await fetch(api_url + options)
  let data = await response.json()
    
  res.status(200).json({
    ...data,
    '_links': {
      'range': {
        'href': '/range'
      }
    },
    'attribution': 'Data provided by CoinGecko'
  })    
})

router.get('/:id/market_chart/range', async (req, res) => {
  if(unsupportedCoinError(req, res)) return
  if(unsupportedFiatError(req, res)) return
  if(invalidTimestampsError(req, res)) return

  const fiat = req.query.vs_currency === undefined ? 'eur' : req.query.vs_currency

  const from = parseInt(req.query.from)
  const to = parseInt(req.query.to) + 60*60

  const api_url = `https://api.coingecko.com/api/v3/coins/${req.params.id}/market_chart/range`
  let options = `?vs_currency=${fiat}&from=${from}&to=${to}`

  // for this assigment, force coingecko to return daily values
  // by ensuring we always ask data for at least 91 days
  const ninetyoneDays = 60*60*24*91
  if(to - from < ninetyoneDays) {
    options = `?vs_currency=${fiat}&from=${to - ninetyoneDays}&to=${to}`
  } 

  const response = await fetch(api_url + options)
  let data = await response.json()  

  // limit data to the date range asked
  if(to - from < ninetyoneDays) {
    const fromInMs = from * 1000
    const toInMs = to * 1000
    data = {
      'prices': data.prices.filter(price => fromInMs <= price[0] && price[0] <= toInMs),
      'market_caps': data.market_caps.filter(cap => fromInMs <= cap[0] && cap[0] <= toInMs),
      'total_volumes': data.total_volumes.filter(vol => fromInMs <= vol[0] && vol[0] <= toInMs)
    }
  }
   
  if(req.query.insights === 'true') {
    data = {
      ...data,
      ...insights.maxVolume(data.total_volumes),
      ...insights.longestDowntrend(data.prices),
      ...insights.maxProfit(data.prices)
    }
  }
  
  res.status(200).json({
    ...data,    
    'attribution': 'Data provided by CoinGecko'
  })
})

module.exports = router