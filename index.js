

function getAllCryptoPrice(callback) {
  // FUNCTION TO GET CRYPTO PRICE.
  // When this function is called, it makes an API call CoinMarketCap and returns JSON
  // callback is what is done after the API all returns.
  // This function essentially returns the same data as if you were to visit this URL - https://api.coinmarketcap.com/v1/ticker/?convert=CAD&limit=10
  // The data it returns is an array of objects. Which means each cryptoprice is at a different index.

  request({
    url : "https://api.coinmarketcap.com/v1/ticker/?convert=CAD&limit=20",
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


// These are specific Routes you can use to see the data for yourself by visiting localhost:3000 followed by the route.
app.get('/', function(req, res) {
  // Visiting this URL ('ie: localhost:3000') will display all crypto price data
  getAllCryptoPrice(function(data) {
    // data now contains all of our crypto price in a neat array. As seen here - https://api.coinmarketcap.com/v1/ticker/?convert=CAD&limit=10
    // data[0] = bitcoin dataType
    // data[1] = ethereum data
    // data[0].price_cad = bitcoin price in canadian
    // data[2].symbol = "XRP"

    // Because the data is returned in an array, this program assumes that Bitcoin
    // will always be priced the highest, and therefore the first in the array.
    // To be safe it would be smarter to loop over them all
    res.send(data);
  })
});

