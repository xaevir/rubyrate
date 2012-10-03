define(function(require) {

var AlertView = require('views/site/alert')
  , tplContacted = require('text!templates/contacted/contacted.mustache')
  , tplAdd = require('text!templates/contacted/add.mustache')
  , Contact = require('models/contact')


var ContactView = Backbone.View.extend({

  tagName:  "tr",

  template: Hogan.compile(tplAdd),

  events: {
    //"dblclick td"  : "edit",
    //"click td"  : "edit",
    //"keypress .edit"  : "updateOnEnter",
    //"blur .edit"      : "close",
    //"click .edit"      : "close",
    'click .create' : 'create'
  },

  initialize: function(options) {
    _.bindAll(this);
    this.model.bind('change', this.render, this);
    this.model.bind('destroy', this.remove, this);
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

  create: function(e) {
    e.preventDefault()
    var $inputs = $('input', this.el);
    var values = {};
    $inputs.each(function() {
        values[this.name] = $(this).val();
    });
    /*
    $.ajax({
      type: "PUT",
      url: '/halfUser/'+this.halfUser._id,
      data: attr  
    })
    */
    //textarea.parent().removeClass("editing");
  },


  render: function() {
    var html = this.template.render(this.model.toJSON())
    this.$el.html(html);
    this.input = this.$('.edit');
    return this;
  },

  /*
  render: function() {
    var template = this.template.render({id: this.model.cid})
    $(this.el).append(template)
    return this
  },
  */

})

var AppView = Backbone.View.extend({

  className: 'contacted',  

  template: Hogan.compile(tplContacted).render(),

  events: {
    "click .create": "createOnSave",
  },

  initialize: function(options) {
    this.subject = options.subject
    _.bindAll(this)
    this.model = new Contact({},{collection: this.collection})
    this.collection.bind('add', this.addOne, this);
    //this.collection.bind('all', this.render, this);
    this.model.bind('sync', this.synched, this);
    Backbone.Validation.bind(this);
  },

  add: function(e) {
    e.preventDefault()   
    this.addOne()
  },

  addOne: function(model) {
    var view = new ContactView({model: model});
    var html = view.render().el 
    $('tbody', this.el).append(html)
  },

  render: function() {
    $(this.el).html(this.template)  
    this.$inputs = $('input', this.el);
    //_.each(this.halfUsers, this.addOne, this);
    return this
  },

  createOnSave: function(e) {
    e.preventDefault()
    var params = {};
    this.$inputs.each(function() {
        params[this.name] = $(this).val();
    });
    this.model.save(params)
  },

  synched: function(model) {
    this.collection.add(model);
    this.$inputs.each(function() {
        $(this).val('');
    });
  },

})
return AppView
})
