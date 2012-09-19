var Spider = require('./spider')
var Events = require('events').EventEmitter
var events = new Events()

var Yelp = module.exports = function(description, location){
  this.url = this.setUrl(description, location)
  this.spider = new Spider()
}

Yelp.prototype.run = function(fn) {
  this.spider.getDom(this.url, function(err, $){
     var companies = this.scrapeCompanies($)
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
    var href = 'http://www.yelp.com'+ a.attr('href')
    var companyName = a.text()
    var companyName = self.extractName(companyName)
    companies.push({companyName: companyName, href:href})
  });
  return companies
}

