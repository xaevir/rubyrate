if (typeof exports === 'object') {
  define = function (factory) {
    module.exports = factory(require, exports, module);
  };
  var node = true
}


define(function(require) {

var NewUser = (node) ? require('./newUser') : require('models/newUser')

var Wish = NewUser.extend({

  idAttribute: "_id",

  url: '/wishes-home',

  defaults: {
    label: 'wish' 
  },

  validation: {
    body:            {required: true},
    twitterOrEmail:  {required: true},
    username:        NewUser.prototype.validation.username,
    location:        {required: true},
    when:            {required: true}
  },

//  parse: function(res){
//    if (res.success === true)  
//      return 
//  }

})

  return Wish

})
