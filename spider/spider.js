//var jsdom = require("jsdom"),
var request = require('request'),
    cheerio = require('cheerio')

function Spider(){
  var num = this.randomNum()
  this.headers['user-agent'] = this.userAgents[num];
}


Spider.prototype.headers = { 
  'accept': "application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5",
  'accept-language': 'en-US,en;q=0.8',
  'accept-charset':  'ISO-8859-1,utf-8;q=0.7,*;q=0.3'
}

Spider.prototype.userAgents = [
  'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
  'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)',
  'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 6.0)',
  'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.13) Gecko/20101203 Firefox/3.6.13',
  'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-GB; rv:1.8.1.6) Gecko/20070725 Firefox/2.0.0.6',
  'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30)',
  'Opera/9.20 (Windows NT 6.0; U; en)',
  'Mozilla/5.0 (Windows; U; Windows NT 6.1; ru; rv:1.9.2) Gecko/20100115 Firefox/3.6',
  'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; MS-RTC LM 8)',
  'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.2 (KHTML, like Gecko) Chrome/6.0',
  'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_7; en-us) AppleWebKit/533.4 (KHTML, like Gecko) Version/4.1 Safari/533.4',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_6) AppleWebKit/534.22 (KHTML, like Gecko) Chrome/11.0.683.0 Safari/534.22'
]

Spider.prototype.randomNum = function() {
  var num = Math.floor((Math.random() * this.userAgents.length)+1)
  return num 
}

Spider.prototype.getDom = function(url, fn){
  request({url:url, headers:this.headers}, function (err, response, body) {
    if (err)  
      return fn(err)
    if (response.statusCode == 200) {
      var $ = cheerio.load(body);
      fn(null, $)
    } else {
      fn('error: status code ' + response.statusCode) 
    }
  })
}

module.exports = Spider
