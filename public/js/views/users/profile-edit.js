define(function(require) {

var tpl = require('text!templates/users/profile-edit.mustache')
  , AlertView = require('views/site/alert')

return Backbone.View.extend({

  className:  "profile-edit span3 offset4",

  events: {
    'submit form' : 'submit'
  },

  template: Hogan.compile(tpl),

  initialize: function(){
    _.bindAll(this) 
  },

  submit: function(e) {
    e.preventDefault()
    var params = this.$('form').serializeObject();
    $.post("/profile", params);
    var router = new Backbone.Router()
    var slug = window.user.get('slug')
    router.navigate('/profile/'+slug, true);
    this.notice()
  },

  render: function(user) {
    var template = this.template.render(user)
    $(this.el).html(template);
    return this;
  },

  notice: function(){
    var successAlert = new AlertView({
      message: '<strong>Saved</strong>',
      type: 'info'
    })
    successAlert.fadeOut()
  },

});

})
