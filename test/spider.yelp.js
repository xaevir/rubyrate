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

  describe('constructor()', function(){
    it('should set up the instance properties', function(){
      var yelp = new Yelp('chiropractor', '33706')
      expect(yelp.url).to.be.a('string')
      expect(yelp.spider).to.be.an('object')
      
      debugger;
      yelp.secondStage = function(){return true} 
      var spy = sinon.spy(yelp, 'secondStage');
      //console.log(yelp.secondStage)
      //yelp.emit('first stage done')
    })
  })

  describe('setupEvents()', function(){
    it('should call the right function when the event is emitted', function(){
        
    })
  })
  describe('run()', function(){
    it('it should call spider and return list of companies', function(done){
      var yelp = new Yelp('chiropractor', '33706')
      var server = http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(bizzesHtml);
      })
      server.listen(5000)

      yelp.url = 'http://localhost:5000'
      var getDom = sinon.spy(yelp.spider, 'getDom')
      var scrapeCompanies = sinon.spy(yelp, 'scrapeCompanies')
      var emit = sinon.stub(yelp, 'emit', function(){})

      yelp.run(function(err, companies){
        expect(getDom).to.have.been.called
        expect(scrapeCompanies).to.have.been.called
        expect(emit).to.have.been.calledWith('first stage done')
        expect(companies).to.be.an('array')
        done()
      })

    }) 
  })
  describe('formatCompanyName()', function(){
    it('should remove number in front of name and white space', function(){
      var yelp = new Yelp('chiropractor', '33706')
      expect(yelp.extractName('1. 	TheMassageSpa  ')).to.equal('TheMassageSpa');
    });
  })
  describe('url()', function(){
    it('should return a url', function(){
      var yelp = new Yelp('chiropractor', '33706')
      var url = yelp.setUrl('chiropractor', '33706')
      expect(url).to.contain('http');
      expect(url).to.contain('chiropractor');
      expect(url).to.contain('33706');
    }) 
    it('should throw an error', function(){
      var yelp = new Yelp('chiropractor', '33706')
      expect(yelp.setUrl).to.throw(Error);
    }) 

  })
  describe('scrapeCompanies()', function(){
    it('should return an array of length 10 with names and hrefs', function(){
      var yelp = new Yelp('chiropractor', '33706')
      var spy = sinon.spy(yelp, 'extractName');
      var $ = cheerio.load(bizzesHtml);
      var companies = yelp.scrapeCompanies($)
      expect(companies.length).to.equal(10)
      expect(companies[0].companyName).to.be.a('string')
      expect(companies[0].url).to.contain('http')
      expect(spy).to.have.been.called
    }) 
  })
})

