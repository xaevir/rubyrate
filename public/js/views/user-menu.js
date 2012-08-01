define(function(require) {

var userMenuTpl = require('text!templates/users/userNav.mustache')


return Backbone.View.extend({

  template: Hogan.compile(userMenuTpl),

  events: {
    "click a": "preventDefault",
    "click a:not([href^='#'])": "pushState",
    'click a[href="#logout"]': 'logout'
  },

  initialize: function(options){
    _.bindAll(this, 'render'); 
    this.model.on('change', this.render, this); 
    this.model.on('destroy', this.clear, this)
  },
  
  preventDefault: function(e) {
    e.preventDefault() 
  },

  pushState: function(e) {
    var linkEl = $(e.currentTarget);
    var href = linkEl.attr("href");
    var router = new Backbone.Router();
    router.navigate(href.substr(1), true)
  },

  logout: function(e){
    e.preventDefault() 
    this.model.destroy({success: function(){
      var router = new Backbone.Router();
      router.navigate('login', {trigger: true})
    }})
  },

  clear: function(model) {
    model.clear()// otherwise fires calls set and validates 
    this.render()
  },

  render: function() {
    var template;
    if (this.model.isLoggedIn()) {
      var locals = {user: this.model.toJSON()}
      template = this.template.render(locals)
    } else {
      template = this.template.render({user: false});
      $('.dropdown-toggle').dropdown()
    }
    $(this.el).html(template)
    return this;
  },
})

});  
