const express = require('express')
const router = express.Router()

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
  res.status(200).json([
    {
      'id': 'bitcoin',
      'symbol': 'btc',
      'name': 'Bitcoin'
    },
  ])
})

module.exports = router