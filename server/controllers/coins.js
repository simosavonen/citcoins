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

const maximizeProfit = (prices) => {
  let max_profit = { 'max_profit': { 'should buy': false, 'profit': 0 } }
  let buy_price = prices[0]
  let sell_price, best_sell_price, best_buy_price
  let profit = 0

  for(let i = 0; i < prices.length - 1; i++) {
    // prices = [[unix timestamp, price], ...]

    // check each price once
    sell_price = prices[i + 1]

    // lower price becomes the new price to buy at
    if(sell_price[1] < buy_price[1]) {
      buy_price = sell_price
    }

    // store the best prices if we found a bigger profit
    else if(profit < sell_price[1] - buy_price[1]) {
      profit = sell_price[1] - buy_price[1]
      best_buy_price = buy_price
      best_sell_price = sell_price
    }
  }

  if(profit > 0) {
    max_profit = { 'max_profit': {
      'should buy': true,
      'when to buy': best_buy_price,
      'when to sell': best_sell_price,
      'profit': profit
    }
    }
  }

  return max_profit

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

    // filter the date range prior to giving it as an argument
    const max_profit = maximizeProfit(data.prices)
    
    res.status(200).json({
      ...data,
      ...trend,
      ...max_profit,
      'max_volume': max_volume,
      '_links': {
        'range': {
          'href': '/range'
        }
      }
    })
  }  
})

router.get('/:id/market_chart/range', async (req, res) => {
  if(coinIsSupported(req, res)) {
    const api_url = 'https://api.coingecko.com/api/v3/coins/' 
      + req.params.id + '/market_chart/range'
    let options = '?vs_currency=eur'  

    // validate query parameters    
    const from = new Date(parseInt(req.query.from))
    const to = new Date(parseInt(req.query.to))

    if(from.getTime() > 0 && to.getTime() > 0 && from.getTime() < to.getTime()) {
      options += '&from=' + from.getTime() + '&to=' + to.getTime()

      const response = await fetch(api_url + options)
      let data = await response.json()
  
      res.status(200).json(data) 

    } else {
      res.status(400).send({ 
        'error': 'malformed request syntax',
        'from': 'required query parameter, unix timestamp',
        'to': 'required query parameter, unix timestamp' 
      })
    }     
  }  
})

module.exports = router