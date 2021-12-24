// needs daily values to answer this assignment
const maxVolume = (volumes) => {
  return {
    'max_volume': volumes.reduce((prev, current) => (prev[1] > current[1]) ? prev : current, 0) 
  }
}

// todo: test does this still work correctly?
const longestDowntrend = (prices) => {
  let previousPrice, currentPrice, trendEnded
  let trendStarted = null
  let longestTrend = 0
  let trend = { 'downtrend': {'found': false }}
    
  for(let i = 1; i < prices.length; i++) {    
    previousPrice = prices[i - 1]
    currentPrice = prices[i]
    if(previousPrice[1] < currentPrice[1] && trendStarted !== null) {         
      // a downtrend just ended   
      const trendLength = trendEnded[0] - trendStarted[0]
      if(trendLength > longestTrend) {
        longestTrend = trendLength
        trend = { 'downtrend': 
              { 'found': true , 
                'start': trendStarted, 
                'end': trendEnded }
        }
      }
      trendStarted = null      
    }    
    // in a downtrend
    if(trendStarted === null) trendStarted = previousPrice
    trendEnded = currentPrice 
  }  
  return trend
}
  
const maxProfit = (prices) => {
  let max_profit = { 'max_profit': { 'should buy': false, 'profit': 0 } }
  let buy_price = prices[0]
  let sell_price, best_sell_price, best_buy_price
  let profit = 0
  
  for(let i = 0; i < prices.length - 1; i++) {
    sell_price = prices[i + 1]
  
    // a lower price becomes the new price to buy at
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

module.exports = {
  maxVolume,
  longestDowntrend,
  maxProfit
}