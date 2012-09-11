define(function(require) {

var NewUser = require('models/newUser')

var Wish = NewUser.extend({

  idAttribute: "_id",

  url: '/wishes-home',

  defaults: {
    label: 'wish' 
  },

  validation: {
    username:    NewUser.prototype.validation.username,
    body:        {required: true},
    location:    {required: true},
    contact:     {required: true}
  },

  parse: function(res){
    if (res.success === true)  
      return 
  }

})

  return Wish

})
