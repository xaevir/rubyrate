define(function(require) {

var Router = require('router')
  , testedRoutes = require('tested-routes')


  var initialize = function(){
     
    window.dispatcher = _.clone(Backbone.Events)
  

    var router = new Router()
    Backbone.history.start({pushState: true});
  }

  return {
    initialize: initialize
  };
});
