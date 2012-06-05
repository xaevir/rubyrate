define(function(require) {

var tpl = require('text!templates/navbar/main-menu.mustache')
  , CreateWishView = require('views/wishes/create_wish')

return Backbone.View.extend({
  
  template: Hogan.compile(tpl),

  events: {
    "click a.create-wish": "renderWishView",
  },

  initialize: function(){
    window.user.on('change', this.render, this)
    _.bindAll(this, 'render') 
  },

  render: function() {
    var loggedIn = window.user.isLoggedIn() 
    var template = this.template.render({user: loggedIn})
    $(this.el).html(template)
    return this
  },

  renderWishView: function(e) {
    var createWishView = new CreateWishView();
    createWishView.render()
  },
})
})
