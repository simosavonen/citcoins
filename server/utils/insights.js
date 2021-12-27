// needs daily values to answer this assignment
const maxVolume = (volumes) => {
  return {
    'max_volume': volumes.reduce((prev, current) => (prev[1] > current[1]) ? prev : current, 0) 
  }
}

const longestDowntrend = (prices) => {
  let priceNow, priceNext, trendEnded
  let trendStarted = null
  let longestTrend = 0
  let response = { 'longest_downtrend': {'found': false }}
  
  for(let i = 0; i < prices.length - 1; i++) {
    priceNow = prices[i]
    priceNext = prices[i + 1]

    // in a downtrend
    if(priceNow[1] > priceNext[1]) {           
      trendEnded = priceNext
      if(trendStarted === null) trendStarted = priceNow  
    } 
        
    // downtrend just ended
    else if(trendStarted !== null) {         
      const trendLength = trendEnded[0] - trendStarted[0]
      if(trendLength > longestTrend) {
        longestTrend = trendLength
        response = { 'longest_downtrend': 
            { 'found': true , 
              'start': trendStarted, 
              'end': trendEnded }
        }
      }
      trendStarted = null
    } 
    
  }
  // edge case, donwtrend continued from start to finish
  if(trendStarted !== null && longestTrend === 0) {
    response = { 'longest_downtrend': 
            { 'found': true , 
              'start': trendStarted, 
              'end': trendEnded }
    } 
  }

  return response
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