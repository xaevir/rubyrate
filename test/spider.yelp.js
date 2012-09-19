var chai = require('chai'),
    expect = chai.expect,
    Yelp = require('../spider/yelp'),
    http = require('http'),
    sinon = require('sinon'),
    sinonChai = require("sinon-chai"),
    fs = require('fs'),
    cheerio = require('cheerio'),
    bizzesHtml = fs.readFileSync(__dirname+'/fixtures/yelpBizzes.html', 'utf8');

chai.use(sinonChai);

describe('Yelp', function(){
  var yelp = new Yelp('chiropractor', '33706')

  describe('constructor()', function(){
    it('should set up the instance properties', function(){
      expect(yelp.url).to.be.a('string')
      expect(yelp.spider).to.be.an('object')
    })
  })
  describe('run()', function(){
    it('it should call spider and return list of companies', function(done){
      var server = http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(bizzesHtml);
      })
      server.listen(5000)

      yelp.url = 'http://localhost:5000'
      var spy = sinon.spy(yelp.spider, 'getDom')
      var spy = sinon.spy(yelp, 'scrapeCompanies')
      
      yelp.run(function(err, companies){
        console.log(companies)  
      })


    }) 
  })
  describe('formatCompanyName()', function(){
    it('should remove number in front of name and white space', function(){
      expect(yelp.extractName('1. 	TheMassageSpa  ')).to.equal('TheMassageSpa');
    });
  })
  describe('url()', function(){
    it('should return a url', function(){
      var url = yelp.setUrl('chiropractor', '33706')
      expect(url).to.contain('http');
      expect(url).to.contain('chiropractor');
      expect(url).to.contain('33706');
    }) 
    it('should throw an error', function(){
      expect(yelp.setUrl).to.throw(Error);
    }) 

  })
  describe('scrapeCompanies()', function(){
    it('should return an array of length 10 with names and hrefs', function(){
      var spy = sinon.spy(yelp, 'extractName');
      var $ = cheerio.load(bizzesHtml);
      var companies = yelp.scrapeCompanies($)
      expect(companies.length).to.equal(10)
      expect(companies[0].companyName).to.be.a('string')
      expect(companies[0].href).to.contain('http')
      expect(spy).to.have.been.called
    }) 
  })
})

