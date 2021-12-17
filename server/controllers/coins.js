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
    await fetch(api_url + req.params.id + '/market_chart' + options)
      .then(response => response.json())
      .then(data => res.status(200).json(data))
  }  
})

module.exports = router