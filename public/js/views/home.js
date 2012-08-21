define(function(require) {

var tpl = require('text!templates/home.mustache')

return Backbone.View.extend({

//  tagName:  "li",

  template: Hogan.compile(tpl),

  initialize: function(wish){
    _.bindAll(this, 'render') 
  },

  events: {
    "click #steps li": function(e){
      var el = $(e.currentTarget)
      this.setupChange(el)
    }
  },

  startingStep: function(){
    var startingEl = $("#steps li:first-child", this.el)
    this.setupChange(startingEl)
  },


  setupChange: function(el) {
    this.highlight(el)
    this.changePaneContent(el)
  },

  highlight: function(el){
    if (el.hasClass('active')) return
    $('#steps li').removeClass('active');
    el.addClass('active');
  },

  changePaneContent: function(el) {
    var target = el.data('target');
    var content = $('#'+target, this.el)
    if (content.hasClass('active')) return
    $('.stepsContent div').removeClass('active');
    content.addClass('active');
  },

  render: function() {
    var template = this.template.render()
    $(this.el).html(template);
    this.startingStep()
    return this;
  },
})

})
