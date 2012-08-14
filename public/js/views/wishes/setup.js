define(function(require) {

var AlertView = require('views/site/alert')
  , tpl = require('text!templates/wishes/business-add.mustache')
  , tplHalfUser = require('text!templates/wishes/half-user.mustache')


var Todo = Backbone.Model.extend({
  // Remove this Todo from *localStorage* and delete its view.
  clear: function() {
    this.destroy();
  }
});

var TodoList = Backbone.Collection.extend({
  model: Todo,

});


var BusinessItem = Backbone.View.extend({

  tagName:  "form",

  template: Hogan.compile(tpl),

  events: {
    "dblclick td"  : "edit",
    "keypress .edit"  : "updateOnEnter",
    "blur .edit"      : "close"
  },

  initialize: function(wish) {
    _.bindAll(this);
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
    var template = this.template.render()
    $(this.el).append(template)
    return this
  },

})

return Backbone.View.extend({

  className: 'setup table table-striped table-bordered',  

  tagName: 'table',

  template: Hogan.compile(tpl),

  events: {
    "click a.addBusiness": "addBusiness",
  },

  initialize: function(options) {
    this.wish = options.wish
    _.bindAll(this)
  },

  addBusiness: function(e) {
    e.preventDefault()   
    this.addOne()
  },

  addOne: function(halfUser, index) {
    var view = new BusinessItem(this.wish);
    $(this.el).append(view.render().el)
  },

  render: function() {
    var template = this.template.render({header: true})
    $(this.el).html(template)  
    //_.each(this.halfUsers, this.addOne, this);
    $(this.el).append('<div><a href="#" class="btn addBusiness">Add Business</a></div>')
    return this
  },
})

})
