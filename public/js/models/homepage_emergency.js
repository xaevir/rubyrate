if (typeof exports === 'object') {
  define = function (factory) {
    module.exports = factory(require, exports, module);
  };
  var node = true
}


define(function(require) {

var NewUser = (node) ? require('./newUser') : require('models/newUser')

var Emergency = NewUser.extend({

  idAttribute: "_id",

  url: '/emergencies-home',

  defaults: {
    label: 'emergency' 
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

  return Emergency

})
