define(function(require) {

//var tpl = require('text!templates/wishes/wish.mustache'),
//var homeTpl = require('text!templates/home.mustache'),
var CreateWishHomepageView = require('views/wishes/create_wish_homepage'),
    HomeView = require('views/home'),
    Router = require('router'),
    AlertView = require('views/site/alert')

Router.prototype.home = function(){
  $('body').addClass('home')
  var wishView = new CreateWishHomepageView({user: this.user})
  var homeView = new HomeView()
  $('#app').html(homeView.render().el)
  $('.home-form', '#app').html(wishView.render().el)


  document.title = 'Ruby Rate'
  _gaq.push(['_trackPageview', '/home'])
}

Router.prototype.reset_home = function(){
  $('body').removeClass('home')
}


return Router 

});
