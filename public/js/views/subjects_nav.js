define(function(require) {

var tpl = require('text!templates/subjects_nav.mustache')
var itemTpl = require('text!templates/subject_nav_item.mustache')

var ItemView = Backbone.View.extend({

  tagName:  "li",

  template: Hogan.compile(itemTpl),

  initialize: function(wish){
    this.wish = wish
    _.bindAll(this) 
  },

  events: {
    "click a": "active",
    "click a:not([href^='#'])": "pushState",
    "click a": "reset_unread" 
  },

  active: function(e){
    //var anchor = $(e.currentTarget)
    var el = $(this.el)
    if (el.hasClass('active')) return
    $('#subjects-nav li').removeClass('active');
    el.addClass('active');
  },

  reset_unread: function(e){
    this.wish.unread = 0
    this.render()
  },

  pushState: function(e) {
    e.preventDefault() 
    var linkEl = $(e.currentTarget)
    var href = linkEl.attr("href")
    var router = new Backbone.Router()
    router.navigate(href.substr(1), true)
  },

  render: function() {
    var wish = this.wish
    var _id = wish._id
    var body = wish.body
    if (wish.body.length > 50) {
      wish.body = wish.body.substr(0, 50) + '...' 
    }

    wish.if_total = (wish.total > 0) ? true : false 
    wish.if_unread = (wish.unread > 0) ? true : false 

    var template = this.template.render(wish)
    $(this.el).html(template);
    return this;
  },
})


var ListView = Backbone.View.extend({
 
  tagName: 'ul',
  className: 'nav nav-pills nav-stacked',

  template: Hogan.compile(tpl),

  initialize: function() {
    _.bindAll(this)
  },

  addOne: function(wish) {
    var view = new ItemView(wish);
    $(this.el).append(view.render().el)
  },

  render: function(wishes) {
    _.each(wishes, this.addOne, this);
    //var el_html = $(this.el).clone().wrap('<p>').parent().html();
    var template = $(this.template.render())
    var h = $(this.el).html()
    if (h != '')
      $('#nav', template).html(this.el)
    return template 
  },

})

return ListView

})
