define(function(require) {

var AlertView = require('views/site/alert').alert
  , AlertErrorView = require('views/site/alert').error         

  // Backbone error messages from server
  _.extend(Backbone.Model.prototype, {
    parse: function(res){
      if (res.success === undefined)
        return res
      if (res.success === true)  
        return res.data 
    },
    onAllErrors: function(jqXHR) {
      var res = $.parseJSON( jqXHR.responseText )
      if (res.message) {
        new AlertErrorView(res.message)
        return
      }    
      if (res.errors) {
        var errorMessage = ''
        _.each(res.errors, function(err) { errorMessage += err + '<br>' })
        new AlertErrorView(errorMessage)
        return
      }    
    }
  })

  Backbone.wrapError = function(onError, originalModel, options) {
    return function(model, resp) {
      resp = model === originalModel ? resp : model;
      if (onError) {
        onError(originalModel, resp, options);
      } else {
        originalModel.trigger('error', originalModel, resp, options);
        if (resp.readyState) originalModel.onAllErrors(resp) //only call if xhr
      }
    };
  };

})



