var sys = require("sys"),
    request = require('request'),
    jsdom = require("jsdom"),
    fs = require('fs'),
    jquery = fs.readFileSync(__dirname+"/../public/js/libs/jquery/jquery.js").toString();
    _ = require('underscore')

var Events = require('events').EventEmitter
var events = new Events()



function getEmail(text) {
  //example: t.s@d.com
  pat = /[-a-zA-Z0-9._]+@[-a-zA-Z0-9_]+.[a-zA-Z0-9_.]+/g
  var result = pat.match(emailPattern)
  if (result)
    return result
  //example: <a href="mailto:t.s@d.com">
  pat = /<a\s+href=\"mailto:([a-zA-Z0-9._@]*)\">/ig
  var result = pat.match(emailPattern)
  if (result)
    return result
  else return false
}

function extractName(name){
    name = name.replace(/\d+\./i,'')
    name = name.trim() 
    return name
}
module.exports.extractName = extractName;

var tempUrls = [
  //var url = 'http://www.yelp.com/search?find_desc='+req.body.find_desc+'&find_loc='+req.body.zip
  'http://localhost'
] 

var basicData;

function doJsdom(body, fn) {
}

function getDomFromUrl(url, fn) {
  var headers = { 
    'accept': "application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5",
    'accept-language': 'en-US,en;q=0.8',
    'accept-charset':  'ISO-8859-1,utf-8;q=0.7,*;q=0.3'
  }
  var user_agents = [
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
  ];
  headers['user-agent'] = user_agents[Math.floor(Math.random() * user_agents.length)];
  request({url:url, headers:headers}, function (err, response, body) {
    if (err) return fn(err)
    if (response.statusCode == 200) {
      jsdom.env({
        html: body,
        src: [ jquery ],
        done: function(errors, window) {
          var $ = window.$
          fn(null, $)
        }
      });
    }
  })
}


exports.spider = function(data, socket){
  doRequest('http://localhost/yelp', function(err, body){
    doJsdom(body, function(err, $){
      scrapeYelpFirst($)
    })
  })
  events.on('yelp first run done', function(res){
    socket.emit('yelp first run', res) 
    res.forEach(function(item) {
      doRequest(item.href, function(err, body){
        doJsdom(body, function(err, $){
          var website = getWebsiteFromYelp($)
          item.website = website     
          socket.emit('got website from yelp', item)
        })
      })
    })
  })
}


function getWebsiteFromYelp($){
  var link = $('#bizUrl a').text()
  return link
}

scrapeYelpFirst = function($) {
  var res = []
  $('.businessresult .itemheading a').each(function() {
    var a = $(this)
    var href = 'http://www.yelp.com'+ a.attr('href')
    var companyName = a.text()
    var companyName = extractName(companyName)
    res.push({companyName: companyName, href:href})
  });
  events.emit('yelp first run done', res)
}


function doManyRequests(urls, fn) {
  var bodies = []
  urls.forEach(function(url){
    doRequest(url, function(err, body){
      bodies.push(body)
    })
  })
  fn(null, bodies)
}

/*
  var job =  new nodeio.Job({spoof: true}, {
    input: data,
    run: function(input) {
      this.getHtml(input.href, function(err, $) {
        if (err) 
          return this.emit('<br>There was an error: '+err+'<br>address: '+input+'<br>')
        try {
          var linkNode = $('#bizUrl a')
          var website = linkNode.text
          console.log('website:'+ website)
          this.emit(website)
        }
        catch(err) {
          this.emit(err)
        }
      });
    },
  })
  nodeio.start(job, function (err, output) {
    fn(err, output)
    return
  }, true);
};
/*
exports.getUrlFromYelp = function(data, fn) {
  var job =  new nodeio.Job({spoof: true}, {
    input: data,
    run: function(input) {
      this.getHtml(input.href, function(err, $) {
        if (err) 
          return this.emit('<br>There was an error: '+err+'<br>address: '+input+'<br>')
        try {
          var linkNode = $('#bizUrl a')
          var website = linkNode.text
          console.log('website:'+ website)
          this.emit(website)
        }
        catch(err) {
          this.emit(err)
        }
      });
    },
  })
  nodeio.start(job, function (err, output) {
    fn(err, output)
    return
  }, true);
};
*/


/*
exports.spider = function(req, res){
  var url = 'http://www.yelp.com/search?find_desc='+req.body.find_desc+'&find_loc='+req.body.zip
  var job =  new nodeio.Job(options, {
    input: [url],
    run: function(input) {
      this.getHtml('http://savewaterproject.com/', function(err, $) {
        if (err) this.exit(err);//Handle any request / parsing errors
        var string = $('body').fulltext
        var emails = getEmail(string)
        if (emails) 
          this.emit(emails);
        else {
          var output = new Array()
          var links = $('a')
          for (i=0; i < links.length; i++) {
            var a = links[i]
            var href = a.attribs.href
            var pattern = /contact/i
            if (pattern.test(href))
              output.push(href)
            //var url = input + href 
            //this.add(url)
            //url = url.split('#')[0] // remove location portion 
            //if (url.match(/^http/) ) //and !isIndexed(url) 
            this.emit(output);
          } 
        }
      });
    },
  })
  nodeio.start(job, function (err, output) {
      console.log(output); 
      res.send(output)
  }, true);
};
*/
