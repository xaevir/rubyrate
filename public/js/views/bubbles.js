define(function(require) {

var tpl = '<div class="{{bubbleClass}}">\
            <blockquote>{{{body}}}</blockquote>\
          </div>\
          <div class="author">{{author}}</div>'


var BubbleView = Backbone.View.extend({

  tagName:  "li",

  template: Hogan.compile(tpl),

  initialize: function(options) {
    this.user = options.user
    _.bindAll(this, 'render');
  },

  render: function() {
    var locals = this.model.toJSON()

    // add color if me or not logged in
    var username = this.user.get('username')
    if (username == this.model.get('author')) {
      locals.bubbleClass = 'bubble-blue-border'
      locals.author = 'Me'
      $(this.el).addClass('seller')
    } else {
      locals.bubbleClass = 'bubble-orange-border'
      $(this.el).addClass('buyer')
    }
    var template = this.template.render(locals)
    $(this.el).html(template);
    return this;
  },
})


return  Backbone.View.extend({

  className: 'bubbles',  
  tagName: 'ul',

  initialize: function(options) {
    _.bindAll(this);
    this.collection.bind('add', this.fadeIn, this)
    this.user = options.user
  },

  fadeIn: function(message){
    var view = new BubbleView({model: message, user: this.user})
    $(view.el).css('display', 'none')
    $(this.el).append(view.render().el)
    $(view.el).fadeIn() 
  },

  addOne: function(message) {
    var view = new BubbleView({model: message, user: this.user})
    $(this.el).append(view.render().el)
  },

  render: function() {
    this.collection.each(this.addOne, this)
    return this
  },
  
})

})
