define(function(require) {

var AlertView = require('views/site/alert')
  , tplContacted = require('text!templates/contacted-companies/contacted.mustache')
  , tplAdd = require('text!templates/contacted-companies/add.mustache')
  , ContactedCompany = require('models/contacted-company')


var ContactView = Backbone.View.extend({

  tagName:  "tr",

  template: Hogan.compile(tplAdd),

  events: {
    "click td"  : "edit",
    //"dblclick td"  : "edit",
    "keypress .edit"  : "updateOnEnter",
    "blur .edit"      : "close",
  },

  initialize: function(options) {
    _.bindAll(this);
    //this.model.bind('change', this.renderCell, this);
    this.model.bind('destroy', this.remove, this);
  },

  edit: function(e){
    var td = $(e.currentTarget)
    this.$td = $(td)
    this.$input = $('input', td)
    this.$td.addClass('editing')
    this.$input.focus()
  },

  updateOnEnter: function(e) {
    if (e.keyCode == 13) this.close();
  },

  close: function() {
    var param = {}
    var key = this.$input[0].name, 
        value = this.$input.val()
    param[key] = value 
    if (this.model.get(key) !== value) { //dont resave the same thing
      this.model.save(param);
      $('label', this.$td).html(value)
    }
    this.$td.removeClass("editing")
  },

  /*
  renderCell: function(model, options){
    var changed = model.changedAttributes()
    for (var key in changed) {
       return $('label', this.$td).html(changed[key])
    }
  },
  */

  render: function() {
    var html = this.template.render(this.model.toJSON())
    this.$el.html(html)
    return this;
  },

})

var AppView = Backbone.View.extend({

  className: 'contacted',  

  template: Hogan.compile(tplContacted).render(),

  events: {
    "click .create": "createOnSave",
  },

  initialize: function(options) {
    _.bindAll(this)
    this.model = new ContactedCompany({},{collection: this.collection})
    this.collection.bind('add', this.addOne, this);
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
    this.$el.html(this.template)  
    this.collection.each(this.addOne, this)
    this.$inputs = $('input', this.el);
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
