var spider = require('../routes/spider'),
    dom = __dirname + '/../routes/yelptest.html',
    http = require('http')
    fs = require('fs')

var yelpPage = fs.readFileSync(dom, 'utf8');
var yelpBiz = fs.readFileSync(__dirname+'/bizPage.html', 'utf8');

var server
var port = 5000

function setUpServer(){
  server = http.createServer(function (req, res) {
    console.log(req.url)
    if (req.url == '/forbidden') {
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end('Forbidden');
    }
    if (req.url == '/yelp') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(yelpPage);
    }
    if (req.url == '/yelpBiz') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(yelpPage);
    }
  })
  server.listen(port)
}
setUpServer()

describe('Spider', function(){
  it('should return formatted company name', function(){
    expect(spider.extractName('1. 	TheMassageSpa  ')).toEqual('TheMassageSpa');
  });
  describe('Yelp Scraper', function(){
    it("should return an error message in the array", function(done) {
      spider.scrapeYelp(['http://127.0.0.1:'+port+'/forbidden'], function(err, output){
        expect(output[0]).toContain('error');
        done()
      })
    })
    it("should return an array of length 10 with names and hrefs", function(done) {
      spider.scrapeYelp(['http://127.0.0.1:'+port+'/yelp'], function(err, output){
        expect(output.length).toEqual(10);
        expect(output[0]).toEqual({ companyName: 'TheMassageSpa', href: 'http://www.yelp.com/biz/the-massage-spa-st-petersburg-2' })
        for (i=0; i < output.length; i++) {
          expect(output[i].companyName).toBeDefined()
          expect(output[i].href).toBeDefined()
        }
        done()
      })
    })
    it("should find the link on the biz page", function(done) {
      var data = [ { companyName: 'TheMassageSpa', href: 'http://www.yelp.com/biz/the-massage-spa-st-petersburg-2' }]
      spider.getUrlFromYelp(data, function(err, output){
        expect(output).toEqual(['http://www.themassagespa.net'])
        done()
        server.close();
      })
    })
  })
})
