var spider = require('../routes/spider'),
    fs = require('fs'),
    JobClass = require('../node_modules/node.io/lib/node.io/job').JobClass,
    job = new JobClass(),
    dom = __dirname + '/../routes/yelptest.html',
    http = require('http')

require('jasmine-node')

var toggle = require('./toggle');
toggle.toggle(function(){



/*        fs.readFile(dom, 'utf8', function(err, data) {
          if (err) throw err;
          job.parseHtml(data, function(err, $, data) {
            if (err) throw err;
          })
        });

      var res = {
        send: function(){} 
      }
      var req = {
        body: {
          find_desc : 'massage',
          zip: '33706'
        } 
      }
*/
describe('Spider', function(){
  it('should return formatted company name', function(){
    expect(spider.extractName('1. 	TheMassageSpa  ')).toEqual('TheMassageSpa');
  });

  describe('Yelp Scraper', function(done){
    beforeEach(function(done) {
      var port = 24510
      var server = http.createServer(function (req, res) {
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end('Forbidden');
      })
      server.listen(port)
    })
    afterEach(function() {
      server.close();
    })
    it("should return an error message", function(done) {
      done = false
      runs(function() {
        var urls = ['http://127.0.0.1:'+port+'/']

        spider.scrapeYelp(urls, function(output){
          var output = output   
          done=true
        })
      })
      waitsFor(function() {
        return done;
      }, "yelp scraper never connected to url ", 750);
      runs(function() {
        expect(output).toContain('error');
      });
    })
  })
})
})
/*
describe("Asynchronous specs", function() {
  var value, flag;

  it("should support async execution of test preparation and exepectations", function() {
    runs(function() {
      flag = false;
      value = 0;

      setTimeout(function() {
        flag = true;
      }, 500);
    });
    waitsFor(function() {
      value++;
      return flag;
    }, "The Value should be incremented", 750);
    runs(function() {
      expect(value).toBeGreaterThan(0);
    });
  });
});
*/
