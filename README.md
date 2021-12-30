<p align="center">
  <a href="" rel="noopener">
 <img width=293px height=67px src="./citcoins_logo.png" alt="Citcoins logo"></a>
</p>



<div align="center">

  [![Status](https://img.shields.io/badge/status-active-success.svg)]() 
  [![GitHub Issues](https://img.shields.io/github/issues/simosavonen/citcoins.svg)](https://github.com/simosavonen/citcoins/issues)
  [![GitHub Pull Requests](https://img.shields.io/github/issues-pr/simosavonen/citcoins.svg)](https://github.com/simosavonen/citcoins/pulls)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> A crypto price discovery tool for the time travelling investor.
    <br> 
</p>

## 📝 Table of Contents
- [About](#about)
- [Live demo](#demo)
- [API reference](#apidoc)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [TODO](../TODO.md)


## 🧐 About <a name = "about"></a>
The assignment was to create an application or an API backend that would let users check the price of bitcoin between two dates. We should also determine, during the given time frame:
1. how many days did the longest downtrend last?
2. which date had the highest trading volume?
3. on which dates should we have bought and sold to maximize profits, if at all possible?

We were to use Coingecko's API for the data. The user is interested in daily values.

Citcoins is a REST API backend. It adds fields to the JSON responses from Coingecko, answering the assignment's questions. It forces daily granularity by requesting at least 91 days worth of data.

## 💥 Live Demo <a name = "demo"></a>
The API is running at https://citcoins.herokuapp.com/api/

To get daily prices, volumes and market caps for bitcoin in euros for the first week of December 2021, with the insights for longest downtrend, day with the highest volume and maximum profit included, send a GET request to

https://citcoins.herokuapp.com/api/coins/bitcoin/market_chart/range?from=1638309600&to=1638828000&insights=true

## 📓 API reference <a name = "apidoc"></a>
The Citcoins API is organized around REST. The API has predictable resource-oriented URLs, returns JSON-encoded responses, and uses standard HTTP response codes.

| Endpoint | Description |
| --- | ----------- |
| `GET /api`  | Returns links to API resources. |
| `GET /api/coins`  | Returns links to API resources. |
| `GET /api/coins/list`  | Lists the IDs of supported crypto and fiat currencies. |
| `GET /api/coins/:id` | Basic information on a cryptocurrency. <br> `id` - cryptocurrency identifier, ex. bitcoin |
| `GET /api/coins/:id/market_chart`  | Returns daily data for 100 days on prices, market caps and total volumes. <br> `id` - cryptocurrency identifier, ex. bitcoin <br> `vs_currency` - optional parameter for fiat currency, ex. eur |
| `GET /api/coins/:id/market_chart/range`  | Returns daily data between the two dates given as parameters. <br>Can also add analytical insights to the response. <br> `id` - cryptocurrency identifier, ex. bitcoin <br> `from=1638309600` - unix timestamp in seconds <br> `to=1638828000` - unix timestamp in seconds <br> `insights=true` - optional parameter for insights <br> `vs_currency` - optional parameter for fiat currency, ex. eur |

  
## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

Make sure you have a recent version of <a href="https://nodejs.org/en/" rel="noopener">Node.js</a> installed.

### Installing

Clone the repository, install Node.js modules.

```
git clone https://github.com/simosavonen/citcoins.git
cd citcoins
cd server
npm install
```


Start the application in development mode.

```
npm run dev
```

The API should now be running at http://localhost:3001/api


## 🔧 Running the tests <a name = "tests"></a>
To run the battery of tests
```
npm test
``` 
The tests are found in directory `/tests` and are separated into integration and unit tests. Integration tests use real data fetched from Coingecko API.


## ⛏️ Built Using <a name = "built_using"></a>
- [Express](https://expressjs.com/) - Server Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment


### Notes to self
Push server subdirectory to heroku
```
git subtree push --prefix server heroku master
```