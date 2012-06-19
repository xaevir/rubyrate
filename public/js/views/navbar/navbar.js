define(function(require) {

var tpl = require('text!templates/navbar/main-menu.mustache')
  , MainMenu = require('views/navbar/main-menu')
  , UserMenu = require('views/navbar/user-menu')

return Backbone.View.extend({
  
  el: '#main-nav',

  events: {
    "click a": "preventDefault",
    "click a:not([href^='#'])": "pushState",
  },

  initialize: function(){
    _.bindAll(this, 'render') 
  },

  preventDefault: function(e) {
    e.preventDefault() 
  },

  pushState: function(e) {
    var linkEl = $(e.currentTarget);
    var href = linkEl.attr("href");
    var router = new Backbone.Router();
    router.navigate(href.substr(1), true)
  },

  render: function() {
    var mainMenu = new MainMenu({ el: this.$("#main-menu") });
    mainMenu.render()
    var userMenu = new UserMenu({ el: this.$("#user-menu") });
    userMenu.render()
  },

})
})
