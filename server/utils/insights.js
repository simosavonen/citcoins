// needs daily values to answer this assignment
const maxVolume = (volumes) => {
  return {
    'max_volume': volumes.reduce((prev, current) => (prev[1] > current[1]) ? prev : current, 0) 
  }
}

const longestDowntrend = (prices) => {
  let previousPrice, currentPrice, trendEnded
  let trendStarted = null
  let longestTrend = 0
  let trend = { 'longest_downtrend': {'found': false }}
    
  for(let i = 1; i < prices.length; i++) {    
    previousPrice = prices[i - 1]
    currentPrice = prices[i]
    if(previousPrice[1] < currentPrice[1] && trendStarted !== null) {         
      // a downtrend just ended   
      const trendLength = trendEnded[0] - trendStarted[0]
      if(trendLength > longestTrend) {
        longestTrend = trendLength
        trend = { 'longest_downtrend': 
              { 'found': true , 
                'start': trendStarted, 
                'end': trendEnded }
        }
      }
      trendStarted = null      
    }    
    if(trendStarted === null) trendStarted = currentPrice
    trendEnded = currentPrice 
  }  
  return trend
}
  
const maxProfit = (prices) => {
  let maxProfit = { 'max_profit': { 'should_buy': false, 'profit': 0 } }
  let buyPrice = prices[0]
  let sellPrice, bestSellPrice, bestBuyPrice
  let profit = 0
  
  for(let i = 0; i < prices.length - 1; i++) {
    sellPrice = prices[i + 1]
  
    // a lower price becomes the new price to buy at
    if(sellPrice[1] < buyPrice[1]) {
      buyPrice = sellPrice
    }
  
    // store the best prices if we found a bigger profit
    else if(profit < sellPrice[1] - buyPrice[1]) {
      profit = sellPrice[1] - buyPrice[1]
      bestBuyPrice = buyPrice
      bestSellPrice = sellPrice
    }
  }
  
  if(profit > 0) {
    maxProfit = { 'max_profit': {
      'should_buy': true,
      'when_to_buy': bestBuyPrice,
      'when_to_sell': bestSellPrice,
      'profit': profit
    }
    }
  }
  return maxProfit
}

module.exports = {
  maxVolume,
  longestDowntrend,
  maxProfit
}