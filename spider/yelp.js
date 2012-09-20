var Spider = require('./spider')
var EventEmitter = require('events').EventEmitter

var Yelp = module.exports = function(description, location){
  this.url = this.setUrl(description, location)
  this.spider = new Spider()
}

Yelp.prototype = new EventEmitter();

Yelp.prototype.setupEvents = function(){
  this.on('firstStageDone', this.scrapeEmail)
}

Yelp.prototype.run = function(fn) {
  var self = this
  this.spider.getDom(this.url, function(err, $){
     var companies = self.scrapeCompanies($)
     self.emit('firstStageDone', companies)
     fn(null, companies)
  })
}

Yelp.prototype.setUrl = function(description, location){
  if (!description || !location)
    throw new Error('need params: description and location') 
  return 'http://www.yelp.com/search?find_desc='+description+'&find_loc='+location
}

Yelp.prototype.extractName = function(name) {
  name = name.replace(/\d+\./i,'')
  name = name.trim() 
  return name
}

Yelp.prototype.scrapeCompanies = function($) {
  var companies = []
  var self = this
  $('.businessresult .itemheading a').each(function() {
    var a = $(this)
    var url = 'http://www.yelp.com'+ a.attr('href')
    var companyName = a.text()
    var companyName = self.extractName(companyName)
    companies.push({companyName: companyName, url:url})
  });
  return companies
}

Yelp.prototype.scrapeEmail = function(companies) {
  /*
  companies.forEach(function(company) {
    this.spider.getDom(company.href, function(err, $){
    doRequest(item.href, function(err, body){
      doJsdom(body, function(err, $){
        var website = getWebsiteFromYelp($)
        item.website = website     
        socket.emit('got website from yelp', item)
      })
    })
  })
  */
}

