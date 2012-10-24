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
//    //this.clear() // so doesnt re-validate unique username
//   // this.unset('username')
//    delete this.attributes.username
///    return res // for setting _id
//  }

})

  return Emergency

})
