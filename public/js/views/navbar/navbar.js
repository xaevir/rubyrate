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

  initialize: function(user){
    _.bindAll(this, 'render') 
    this.user = user
  },


  render: function() {
    var mainMenu = new MainMenu({ el: this.$("#main-menu") });
    mainMenu.render()
//    var userMenu = new UserMenu({ el: this.$("#user-menu") });
//    userMenu.render()
  },

})
})
