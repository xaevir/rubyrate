define(function(require) {

  var User = Backbone.Model.extend({

    idAttribute: "_id",

    validation: {
      _id:        {required: true},
      username:   {required: true}
    },

    isLoggedIn: function(){
       return Boolean(this.get("username"))
    }  


  })

  return User

})
