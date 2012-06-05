define(function(require) {

var hogan = require('libs/hogan.js/web/builds/2.0.0/hogan-2.0.0.min.amd')


return Backbone.View.extend({

  className: 'alert',

  //template: hogan.compile('<div class="alert alert-{{type}}"> {{{message}}} </div>'),

  events: { /* twitter bootstrap handles these*/ },

  initialize: function(options){
    _.bindAll(this, 'fadeOut', 'render') 
    this.message = options.message
    this.type = options.type
    //this.collection.on('add', this.render, this)
    this.render() 
  },

  addClassName: function(type){
    $(this.el).addClass('alert-' + type)
  },

  render: function(){
    $(this.el).html(this.message)
    this.addClassName(this.type)
    $('body').prepend(this.el)
    $(this.el).center()
    return this
  },

  fadeOut: function(){
   var that = this
   var t = setTimeout(function(){
    $(that.el).fadeOut('slow', function() {
      $(that.el).remove();
     });
    }, 3000);
  },

});

});
