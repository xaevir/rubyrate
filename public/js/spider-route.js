define(function(require) {

var View = require('views/spider')

Backbone.Router.prototype.spider = function(){
  this.view = new View({context: 'main'})
  this.view.render()
  $('#app').html(this.view.el)
  document.title = 'Spider'
  _gaq.push(['_trackPageview', '/spider'])
}

});
