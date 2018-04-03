
// **** Shopify Private App for Getting Crypto Prices
// and Updating Product Prices in Shopify Store *****

// INDEX.JS (MAIN FILE)

// INSTALL DEPENDENCIES
// All of these dependencies can be found on npmjs.com
const express = require('express'); // Install request (jquery for node)
const app = express();  // Establish the express app
var request = require('request'); // Library for making API calls
var bodyParser = require('body-parser'); // For decoding JSON
var schedule = require('node-schedule'); // For running cron jobs
var cors = require('cors');


function cryptoCron() {
  // CRON JOB
  // This will run every 10 seconds to get bitcoin price
  // var timer = '*/10 * * * * *'; // For info on timer see https://www.npmjs.com/package/node-schedule
  var timer = '* */5 * * * '; // 5 minute
  // var timer = '* * * * * 1'

  var myCron = schedule.scheduleJob(timer, function() {
    console.log('Running Cron');
    // For each product ID in the productID array that gets returned, get data
    for (var key in productDict) {
      getProductPrice(productDict[key], function(data) {
        var p = JSON.parse(data);
        var productVariants = p.product.variants;

        // First check that the price is correct
        var split = productVariants[0].title.split(" ");
        var qty = split[0];
        var coinCode = split[1];

        var q = qty * (1 / qty); // Make sure we're looking at one of the coin to check price

        // Check if the crypto price matches
        getCryptoPrice(coinCodes[coinCode], function(data){
          var coinMarketPrice = data[0].price_usd;
          prices[coinCode] = data[0].price_usd;
          // console.log(coinMarketPrice);
          // Check if price !== Coin Market Price. * qty is added so that if we're
          // checking a variant that is 0.5 btc or 100 btc it will still work.
          if (((productVariants[0].price * qty) / profitMultiplier)  !== (coinMarketPrice * qty)) {
            // For each of the variants in the product get the code and the price.
            productVariants.forEach(function(v) {
              var split = v.title.split(" "); // Seperate the code by the space (" ")
              var qty = split[0]; // btc
              var price = (coinMarketPrice * qty) * profitMultiplier;
              // console.log(coinMarketPrice * qty , v.price);
              updateVariantPrice(v.id, price);
              // console.log("Qty: ", qty," Code: ", coinCode, q);
            });
          } else {
            console.log("Prices Match!");
          }
        });

      });
    };
  })
};

function getAllCryptoPrice(callback) {
  // FUNCTION TO GET CRYPTO PRICE.
  // When this function is called, it makes an API call CoinMarketCap and returns JSON
  // callback is what is done after the API all returns.
  // This function essentially returns the same data as if you were to visit this URL - https://api.coinmarketcap.com/v1/ticker/?convert=USD&limit=10
  // The data it returns is an array of objects. Which means each cryptoprice is at a different index.

  request({
    url : "https://api.coinmarketcap.com/v1/ticker/?convert=USD&limit=20",
    method: "GET",
    dataType: "json"
  }, function(err, resp) {
    if (err) {
      // Something went wrong. Log to console.
      console.log(err);
    } else {
      var data = JSON.parse(resp["body"]); // The response is a HTTPS response object, so we want to let it know it's JSON and parse just the body as such
      callback(data); // Return the data to our callback so it can do stuff with it.
    }
  });
};

