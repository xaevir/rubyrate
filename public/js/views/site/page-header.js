define(function(require) {

return Backbone.View.extend({

  className: 'page-header',

  template: function(catLabel){
    return '<h1 class="container">' + catLabel  + '</h1>'
  },

  initialize: function(options){
    _.bindAll(this, 'render') 
    this.header = options.header
  },

  render: function() {
    var template = this.template(this.header)
    $(this.el).html(template)
    $('#app').before(this.el)
  },

})
})
