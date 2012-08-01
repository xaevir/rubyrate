define(function(require) {

//var tpl = require('text!templates/wishes/wish.mustache'),
var homeTpl = require('text!templates/home.mustache'),
    CreateWishHomepageView = require('views/wishes/create_wish_homepage'),
    Router = require('router'),
    AlertView = require('views/site/alert')

Router.prototype.home = function(){
  var wishView = new CreateWishHomepageView({user: this.user})
  $('#app').html(homeTpl)
  $('.home-form', '#app').html(wishView.render().el)
  document.title = 'Ruby Rate'
  _gaq.push(['_trackPageview', '/home'])
}


return Router 

});
