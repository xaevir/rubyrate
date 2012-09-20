define(function(require) {

var tpl = require('text!templates/users/profile-edit.mustache')
  , AlertView = require('views/site/alert').alert

return Backbone.View.extend({

  className:  "small-content",

  events: {
    'submit form' : 'submit'
  },

  template: Hogan.compile(tpl),

  initialize: function(options){
    _.bindAll(this) 
    this.user = options.user
  },

  submit: function(e) {
    e.preventDefault()
    var params = this.$('form').serializeObject();
    $.post("/profile", params);
    var router = new Backbone.Router()
    var slug = this.user.get('slug')
    router.navigate('/profile/'+slug, true);
    new AlertView('Saved')
  },

  render: function(user) {
    var template = this.template.render(user)
    $(this.el).html(template);
    return this;
  },
});

})
