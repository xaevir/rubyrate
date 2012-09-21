define(function(require) {

var tpl = require('text!templates/navbar/main-menu.mustache')
  , CreateWishView = require('views/wishes/create_wish')

return Backbone.View.extend({
  
  template: Hogan.compile(tpl),

  events: {
    "click a:not([href^='#'])": "pushState",
    "click a.create-wish": "renderWishView",
  },

  initialize: function(options){
    this.user = options.user
    this.isHome = options.isHome
    this.user.on('change', this.render, this)
    _.bindAll(this, 'render') 
  },

  preventDefault: function(e) {
  },

  pushState: function(e) {
    e.preventDefault() 
    var linkEl = $(e.currentTarget);
    var href = linkEl.attr("href");
    var router = new Backbone.Router();
    router.navigate(href.substr(1), true)
  },

  render: function() {
    var loggedIn = this.user.isLoggedIn() 
    var template = this.template.render({user: loggedIn, isHome: this.isHome})
    $(this.el).html(template)
    return this
  },

  renderWishView: function(e) {
    e.preventDefault() 
    var createWishView = new CreateWishView();
    createWishView.render()
  },
})
})
