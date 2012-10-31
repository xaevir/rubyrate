define(function(require) {

var HomeView = require('views/home'),
    Router = require('router')

Router.prototype.home = function(thankyou) {
  $('body').attr('id','home')
  var homeView = new HomeView({thankyou: thankyou})
  $('#app').html(homeView.render().el)
  document.title = 'Ruby Rate'
  _gaq.push(['_trackPageview', '/home'])
}

Router.prototype.reset_home = function(){
  $('body').removeAttr('id')
}

Router.prototype.electronic_repair = function(){
  var view = new HomeView({user: this.user})
  view.render()
  $('#home', view.el).addClass('electronic-repair')
  $('h1', view.el).html('We help you find someone that will repair your electronics')
  $('.one', view.el).html('Enter the device/model and what is broken in the request box.')
  $('.four', view.el).html('Converse with mutiple providers in an easy format on our website. \
        Talk to them about price, how lond it will take to repair, or anything \
        else you might need to get the phone fixed')
  $('#body', view.el).attr('placeholder','For example - angroid global 2, broken screen')
  $('#app').html(view.el)
  document.title = 'Ruby Rate - electronic repair'
  _gaq.push(['_trackPageview', '/electronic repair'])
}


return Router 

});
