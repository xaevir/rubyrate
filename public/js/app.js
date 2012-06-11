define(function(require) {

var Router = require('router')
  , User = require('models/user')
  , NavBar = require('views/navbar/navbar')         


  var initialize = function(){
     
    window.dispatcher = _.clone(Backbone.Events)
  
    window.user = new User()

    var navBar = new NavBar()
    navBar.render()

    var router = new Router()
    Backbone.history.start({pushState: true});
  }

  return {
    initialize: initialize
  };
});
