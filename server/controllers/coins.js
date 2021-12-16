const express = require('express')
const router = express.Router()
const config = require('../utils/config')

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

router.get('/:id/market_chart', (req, res) => {
  if(coinIsSupported(req, res)) {
    res.status(200).json({
      'success': 'market chart for ' + req.params.id 
    })
  }  
})

module.exports = router