const express = require('express')
const router = express.Router()
const config = require('../utils/config')
const fetch = require('node-fetch')

const coinIsSupported = (request, response) => {  
  if(config.COINS.some(c => c.id !== request.params.id)) {
    response.status(404).json({
      'error': 'unsupported cryptocurrency'
    })
    return false    
  }
  return true
}

// todo: move these into a helper file
const longestDowntrend = (prices) => {
  let prev, current, end
  let start = null
  let best = 0
  let trend = { 'downtrend': {'found': false }}
  
  for(let i = 1; i < prices.length; i++) {
    // prices = [[unix timestamp, price], ...]
    prev = prices[i - 1]
    current = prices[i]
    if(prev[1] > current[1]) {
      // in a downtrend
      if(start === null) start = prev
      end = current  
    } else {      
      if(start !== null) {     
        // downtrend just ended   
        const trendLength = end[0] - start[0]
        if(trendLength > best) {
          best = trendLength
          trend = { 'downtrend': 
            { 'found': true , 
              'start': start, 
              'end': end }
          }
        }
        start = null
      } 
    }
  }  
  return trend
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
  if(coinIsSupported(req, res)) {
    const coin = config.COINS.filter(c => c.id === req.params.id)

    res.status(200).json({
      ...coin[0],
      '_links': {
        'market_chart': {
          'href': '/market_chart'
        }
      }
    })

  }  
})

router.get('/:id/market_chart', async (req, res) => {
  if(coinIsSupported(req, res)) {
    const api_url = 'https://api.coingecko.com/api/v3/coins/'
    const options = '?vs_currency=eur&days=100'

    const response = await fetch(api_url + req.params.id + '/market_chart' + options)
    let data = await response.json()

    // data = {'prices': [[unix timestamp, price], ...],
    // 'market_caps': [[unix timestamp, market cap], ...],
    // 'total_volumes': [[unix timestamp, total volume], ...]}

    const max_volume = data.total_volumes.reduce((prev, current) => (prev[1] > current[1]) ? prev : current, 0)
   
    // todo: only add these if user asked for them
    // maybe create an '/coins/insights' endpoint
    const trend = longestDowntrend(data.prices)
    
    res.status(200).json({
      ...data,
      ...trend,
      'max_volume': max_volume,
      '_links': {
        'range': {
          'href': '/range'
        }
      }
    })
  }  
})

module.exports = router