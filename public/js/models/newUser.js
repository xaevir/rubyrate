if (typeof exports === 'object') {
  define = function (factory) {
    module.exports = factory(require, exports, module);
  };
  bcrypt = require('bcrypt')
  var app = require('../../../app')
}

_.extend(Backbone.Validation.validators, {
  isUniqueUsername: function(value, attr, customValue, model){
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

  isUniqueEmail: function(value, attr, customValue, model) {
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

  singleSpace: function(value, attr, customValue, model){
    var result = /\s{2,}/g.test(value);
    if (result === true)
      return 'Username must contain only single spaces.'
  },

  spaceBeginEnd: function(value, attr, customValue, model){
    var result = /(^\s|\s$)/g.test(value);
    if (result === true)
      return 'Username can not begin with or end with a space.'
  },
})



define(function(require) {

  var User = Backbone.Model.extend({
    
    url: '/user',

    initialize: function() {
      this.on("change:username", function(model, value, options) {
        //if (!value) return
        this.setSlug(value)
      })
    },

    idAttribute: "_id",

    validation: {
      username: { 
        required: true,
        minLength: 2,
        maxLength: 60,
        isUniqueUsername: 1,
        singleSpace :1,
        spaceBeginEnd: 1,
      },
      email: {
        required: true,
        pattern: 'email',
        isUniqueEmail: 1
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
      name = name || ''
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
