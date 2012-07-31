var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon')
    Spider = require('../routes/spider').Spider,
    Yelp = require('../routes/spider').Yelp,
    http = require('http'),
    fs = require('fs'),
    jsdom = require("jsdom"),
    jquery = fs.readFileSync(__dirname+"/../public/js/libs/jquery/jquery.js", 'utf8'),
    sinonChai = require("sinon-chai");

chai.use(sinonChai);

var dom = __dirname + '/../routes/yelptest.html'
var yelpGetWebsite = fs.readFileSync(__dirname+'/yelpGetWebsite.html', 'utf8');



describe('Spider', function(){
  describe('getDomFromUrl()', function(){
    it('should return a jquery instance', function(done){
      var spider = new Spider()  

      var server = http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('<!DOCTYPE html>');
      })
      server.listen(5000)

      spider.getDomFromUrl('http://localhost:5000', function(err, $){
        expect($('html')).to.be.ok
        server.close()
        done()
      })
    })
  })
})

describe('Yelp', function(){
  describe('getCompanies()', function(){
    it('should return an array of length 10 with names and hrefs', function(done){
      var yelp = new Yelp()  
      var yelpBizzes = fs.readFileSync(__dirname+'/yelpBizzes.html', 'utf8');
      var spy = sinon.spy(yelp, 'formatCompanyName');

      jsdom.env({
        html: yelpBizzes,
        src: [ jquery ],
        done: function(errors, window) {
          var $ = window.$
          yelp.getCompanies($, function(err, companies){
            expect(companies.length).to.equal(10); 
            expect(companies[0]).to.have.property('companyName');
            expect(companies[0]).to.have.property('href');
            expect(spy).to.have.been.called
            done()
          })
        }
      })
    }) 
  })
  describe('formatCompanyName()', function(){
    it('should remove number in front of name and white space', function(){
      var yelp = new Yelp()  
      expect(yelp.formatCompanyName('1. 	TheMassageSpa  ')).to.equal('TheMassageSpa')
    })
  })
})



