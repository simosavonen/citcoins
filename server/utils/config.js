require('dotenv').config()

let PORT = process.env.PORT || 3001

// supported cryptocurrencies
const COINS = [{
  'id': 'bitcoin',
  'symbol': 'btc',
  'name': 'Bitcoin'
}]

// supported fiat currencies
const FIAT = ['eur']

module.exports = {
  PORT,
  COINS,
  FIAT
}