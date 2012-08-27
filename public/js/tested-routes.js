define(function(require) {

var CreateWishHomepageView = require('views/wishes/create_wish_homepage'),
    HomeView = require('views/home'),
    Router = require('router'),
    AlertView = require('views/site/alert')

Router.prototype.home = function(){
  $('body').addClass('home')
  var wishView = new CreateWishHomepageView({user: this.user})
  $('#app').html(wishView.render().el)


  document.title = 'Ruby Rate'
  _gaq.push(['_trackPageview', '/home'])
}

Router.prototype.reset_home = function(){
  $('body').removeClass('home')
}


return Router 

});
