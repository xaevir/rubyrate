define(function(require) {

return Backbone.View.extend({

  className: 'contextual-menu',
  tagName: 'ul',

  template: Hogan.compile('<li><a href="/profile/{{username}}/edit" class="btn">Edit</a></li>'),

  events: {
    "click a": "preventDefault",
    "click a:not([href^='#'])": "pushState",
  },

  initialize: function(options){
    _.bindAll(this, 'render') 
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

  render: function() {
    var username =window.user.get('username')
    var template = this.template.render({username: username})
    $(this.el).html(template)
    return this
  },

})
})
