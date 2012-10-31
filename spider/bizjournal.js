var Spider = require('./spider')
var EventEmitter = require('events').EventEmitter

var bizJournal = module.exports = function(description, location){
  this.url = this.setUrl(description, location)
  this.spider = new Spider()
  this.on('first stage done', this.secondStage)
}

Yelp.prototype = new EventEmitter();

Yelp.prototype.run = function(fn) {
  var self = this
  this.spider.getDom(this.url, function(err, $){
     var companies = self.scrapeCompanies($)
     self.emit('first stage done', companies)
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

Yelp.prototype.secondStage = function(companies) {
  throw Error('shoudl not be calling this func secondStage')
  /*
  companies.forEach(function(company) {
    this.spider.getDom(company.url, function(err, $){
      var website = $('#bizUrl a').text()
      company.website = website
    })
  })
  */
}

