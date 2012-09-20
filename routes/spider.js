var app = require('../app').app,
    Yelp = require('../spider/yelp')
  
app.post('/spider', function (req, res) {
  //req.body
  console.log ('request being handled by: get /spider');
});
