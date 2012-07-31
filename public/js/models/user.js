define(function(require) {

  var User = Backbone.Model.extend({

    idAttribute: "_id",

    url: '/user',

    isLoggedIn: function(){
      return Boolean(this.get("username"))
    }, 

    parse: function(res){
    
    },

  })

  return User

})
