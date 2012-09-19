var chai = require('chai'),
    expect = chai.expect,
    Spider = require('../spider/spider'),
    http = require('http'),
    sinon = require('sinon'),
    sinonChai = require("sinon-chai");

chai.use(sinonChai);


describe('Spider', function(){
  describe('constructor', function(){
    it('should setup an instance', function(){
      var spy = sinon.spy(Spider.prototype, 'randomNum');
      var spider = new Spider()  
      expect(spy).to.have.been.called
      expect(spider.headers['user-agent']).to.be.a('string')
    })
  })
  describe('randomNum()', function(){
    it('should get a num between 0 and userAgent.length', function(){
      var spider = new Spider()  
      var total = spider.userAgents.length
      expect(spider.randomNum()).to.be.within(0,total)
    })
  })
  describe('getDom()', function(){
    it('should return an error', function(done){
      var spider = new Spider()  
      spider.getDom('http://localhost:9999', function(err, $){
        expect(err).to.be.ok
        done()
      })
    })
    it('should return a string error', function(done){
      var spider = new Spider()  

      var server = http.createServer(function (req, res) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('<!DOCTYPE html>');
      })
      server.listen(5000)

      spider.getDom('http://localhost:5000', function(err, $){
        expect(err).to.be.a('string')
        server.close()
        done()
      })
    })
    it('should return a jquery instance', function(done){
      var spider = new Spider()  

      var server = http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('<!DOCTYPE html>');
      })
      server.listen(5000)

      spider.getDom('http://localhost:5000', function(err, $){
        expect($('html')).to.be.an('object')
        server.close()
        done()
      })
    })
  })
})

