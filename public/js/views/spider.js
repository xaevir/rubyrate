define(function(require) {

var tpl = require('text!templates/spider.mustache')
  , AlertView = require('views/site/alert')         
  , basicTpl = require('text!templates/spider/basic.mustache')

return Backbone.View.extend({
  
  id: 'spider',

  events: {
    'submit form' : 'submit',
    'a .close' : 'closeNotice'
  },

  template: Hogan.compile(basicTpl),

  initialize: function(options){
    _.bindAll(this); 
    this.socket = io.connect();
    var self = this
    this.socket.on('yelp first run', function(data) {
      var msg = 'Got Yelp business names and their yelp addresses.'
          msg += 'Now working on scraping yelp for their actual website.'
      self.notice(msg)
      self.loadData(data)
    })
    this.socket.on('got website from yelp', function(data) {
      //var el = $('td', this.el).find(":contains("+data.companyName+")") 
      var el = $("td:contains("+data.href+")", self.el).css("text-decoration", "underline");
      $(el).animate({ backgroundColor: "yellow" }, 1000)  , function(){
        $(el).animate({ backgroundColor: "#68BFEF" }, 500);
      };
      $(el).text(data.href)
    })
  },

  render: function(){
    $(this.el).html(tpl);
    this.addNotice()
    return this; 
  },

  loadData: function(data){
    var template = this.template.render({bizzes: data})
    $('#results').html(template)
  },

  submit: function(e) {
    e.preventDefault()
    var params = this.$('form').serializeObject();
    this.socket.emit('start scraper', params);
    $('#spinner').css('display', 'block')
  },

  addNotice: function(){
    var html  = '<div class="notice" style="display: none"><div class="container">' 
        html += '<a class="close" data-dismiss="alert" href="#">×</a>'
        html += '<span class="msg"></span>'
        html += '</div></div>'
    $(this.el).append(html)
  },

  notice: function(msg){
    $('.notice .msg').html(msg)    
    $('.notice').css('display', 'block')
  },
  
  closeNotice: function(){
    $('.notice').css('display', 'none')
  }

});

});
