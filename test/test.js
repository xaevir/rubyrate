var chai = require('chai'),
    expect = chai.expect,
    spider = require('../routes/spider'),
    http = require('http')
    fs = require('fs')

    dom = __dirname + '/../routes/yelptest.html',

var yelpBizzes = fs.readFileSync(__dirname+'/yelpBizzes.html', 'utf8');
var yelpGetWebsite = fs.readFileSync(__dirname+'/yelpGetWebsite.html', 'utf8');


describe('Spider', function(){
  var port = 5000
  var server;  
  it('should return formatted company name', function(){
    expect(spider.extractName('1. 	TheMassageSpa  ')).to.equal('TheMassageSpa');
  });

  describe('Error loading webpage', function(){
    before(function(){
      console.log('before function')
      server = http.createServer(function (req, res) {
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end('Forbidden');
        console.log('server started')
      })
      server.listen(port)
      console.log('server listening on port' + port)
    })
    after(function(){
      server.close();
    })
    it("should return an error message in the array", function(done) {
      spider.scrapeYelp(['http://127.0.0.1:'+port+'/'], function(err, output){
        console.log('output coming')
        console.log(output)
        //expect(output[0]).to.contain('error');
        done()
      })
    })
  })
})
