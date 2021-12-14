const express = require('express')
const router = express.Router()
const fetch = require("node-fetch")

router.get('/', async (req, res, next) => {
    const api_url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur'
    
    const response = await fetch(api_url)
    const data = await response.json()
    res.json(data)
})

router.get('/list', (req, res, next) => {
    res.status(200).json([
        {
            "id": "bitcoin",
            "symbol": "btc",
            "name": "Bitcoin"
        }
    ])
})

module.exports = router