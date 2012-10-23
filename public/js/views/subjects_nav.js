define(function(require) {

var tpl = require('text!templates/subjects_nav.mustache')
var itemTpl = require('text!templates/subject_nav_item.mustache')

var ItemView = Backbone.View.extend({

  tagName:  "li",

  template: Hogan.compile(itemTpl),

  initialize: function(emergency){
    this.emergency = emergency
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
    this.emergency.unread = 0
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
    var emergency = this.emergency
    var _id = emergency._id
    var body = emergency.body
    if (emergency.body.length > 50) {
      emergency.body = emergency.body.substr(0, 50) + '...' 
    }

    emergency.if_total = (emergency.total > 0) ? true : false 
    emergency.if_unread = (emergency.unread > 0) ? true : false 

    var template = this.template.render(emergency)
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

  addOne: function(emergency) {
    var view = new ItemView(emergency);
    $(this.el).append(view.render().el)
  },

  render: function(emergencies) {
    _.each(emergencies, this.addOne, this);
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
