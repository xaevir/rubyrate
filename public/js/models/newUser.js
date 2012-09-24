if (typeof exports === 'object' && typeof define !== 'function') {
  define = function (factory) {
    module.exports = factory(require, exports, module);
  };
  bcrypt = require('bcrypt')
  var app = require('../../../app')
}

define(function(require) {

  var User = Backbone.Model.extend({
    
    url: '/user',

    initialize: function() {
      this.on("change:username", function(model, value, options) {
        if (!value) return
        this.setSlug(model.get('username'))
      })
    },

    idAttribute: "_id",

    isUniqueUsername: function(value, attr, computedState){
      var isUnique;
      if (typeof exports === 'object') {
        app.isUniqueUsername(value, function(resUnique){
          isUnique = resUnique    
        })
      } 
      else {
        $.ajax({ url: "/is-unique-username", 
          data: {username: value}, 
          async: false, 
          success: function(res) { 
            isUnique = res  
          }
        })
        if (isUnique === false)
          return 'Please try another username. This one is taken.'
      }
    },

    isUniqueEmail: function(value, attr, computedState) {
      if (typeof exports === 'object') return 
      var isUnique
      $.ajax({ url: "/check-email", 
        data: {email: value}, 
        async: false, 
        success: 
        function(res) { 
          isUnique = res  
        }
      })
      if (isUnique === false)
        return 'This email is already taken. Please try another.'
    },

    singleSpace: function(value, attr, computedState){
      var result = /\s{2,}/g.test(value);
      if (result === true)
        return 'Username must contain only single spaces.'
    },

    validation: {
      username: { 
        required: true,
        minLength: 2,
        maxLength: 60,
        fn: 'singleSpace',
        fn: 'isUniqueUsername'
      },
      email: {
        required: true,
        pattern: 'email',
        fn: 'isUniqueEmail'
      },
      password: {
        required: true,
        minLength: 6,
      },
      slug: {required: function(){
          if (typeof exports === 'object')
            return {required: true}
        } 
      }
    },

    setSlug: function(name) {
      var slug = name.replace(/^@/, '')  //twitter
      slug = slug.replace(/[^a-zA-z0-9_\-]+/g, '-').toLowerCase()
      this.set({'slug': slug}, {silent: true})
      return slug
    },
  
    setPassword: function(fn){
      var user = this
      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(user.get('password'), salt, function(err, hash){
          user.set({password: hash}, {silent: true})
          fn()
        })
      }) 
    },
    
  })

  return User

})
