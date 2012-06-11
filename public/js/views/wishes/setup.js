define(function(require) {

var AlertView = require('views/site/alert')
  , tpl = require('text!templates/wishes/business-add.mustache')
  , tplHalfUser = require('text!templates/wishes/half-user.mustache')


var BusinessItem = Backbone.View.extend({

  tagName:  "tr",

  template: Hogan.compile(tplHalfUser),

  events: {
    "dblclick td"  : "edit",
    "keypress .edit"  : "updateOnEnter",
    "blur .edit"      : "close"
  },

  initialize: function(halfUser, wish) {
    _.bindAll(this, 'render');
    this.halfUser = halfUser
    this.wish = wish
  },

  edit: function(e){
    var td = $(e.currentTarget)
    $(td).addClass('editing')
    $('textarea', td).focus()
    //this.input.focus();
  },

  updateOnEnter: function(e) {
    if (e.keyCode == 13) this.close(e);
  },

  close: function(e) {
    var textarea = $(e.currentTarget)
    var textarea = $(textarea)
    var value = textarea.val();
    var name = textarea.attr('name');
    var attr = {};
    attr[name] = value
    $.ajax({
      type: "PUT",
      url: '/halfUser/'+this.halfUser._id,
      data: attr  
    })
    textarea.parent().removeClass("editing");
  },


  render: function() {
    var template = this.template.render({user:this.halfUser})
    $(this.el).append(template)
    return this
  },

})

return Backbone.View.extend({

  className: 'setup table table-striped table-bordered',  

  tagName: 'table',

  template: Hogan.compile(tplHalfUser),

  events: {
    "click a.addBusiness": "addBusiness",
  },

  initialize: function(options) {
    this.wish = options.wish
    this.halfUsers = options.halfUsers
    var template = this.template.render({head: true})
    $(this.el).append(template)
    _.bindAll(this)
  },

  addBusiness: function(e) {
    e.preventDefault()   
    this.addOne()
  },

  addOne: function(halfUser, index) {
    var view = new BusinessItem(halfUser, this.wish);
    $(this.el).append(view.render().el)
  },

  render: function() {
    _.each(this.halfUsers, this.addOne, this);

    $(this.el).append('<div><a href="#" class="btn addBusiness">Add Business</a></div>')
    return this
  },
})

})
