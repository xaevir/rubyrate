define(function(require) {

var AlertView = require('views/site/alert').alert
  , tpl = require('text!templates/editMessage.mustache') 

  return Backbone.View.extend({

    template: Hogan.compile(tpl),
   
    className: 'modal modal-edit',

    events: {
      'submit form' : 'submit'
    },

    button: '',

    initialize: function() {
      _.bindAll(this);
    },

  render: function () {
    var template = this.template.render({largeButton: this.largeButton})
    $(this.el).html(template);
    var tArea = $('textarea', this.el) 
    tArea.wysihtml5({
      "font-styles": false, //Font styling, e.g. h1, h2, etc. Default true
      "emphasis": true, //Italics, bold, etc. Default true
      "lists": false, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
      "html": false, //Button which allows you to edit the generated HTML. Default false
      "link": true, //Button to insert a link. Default true
      "image": false //Button to insert an image. Default true
    });
    return this
  },


    render: function () {
      var template = this.template.render();
      $(this.el).html(template);
      var tArea = $('textarea', this.el) 
      tArea.wysihtml5({
        "font-styles": false, //Font styling, e.g. h1, h2, etc. Default true
        "emphasis": true, //Italics, bold, etc. Default true
        "lists": false, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
        "html": false, //Button which allows you to edit the generated HTML. Default false
        "link": true, //Button to insert a link. Default true
        "image": false //Button to insert an image. Default true
      });
      $(this.el).modal('show');
      this.globalEvent()
      this.button = $('button[type="submit"]', this.el);
      return this
    },

    submit: function (e) {
      e.preventDefault()
      var tArea = $('#textarea-modal')
      if (tArea.val() == '') 
        return
      //var params = this.$('form').serializeObject();
      var self = this
      this.model.save({body: tArea.val()}) 
      this.close()
      new AlertView('Message Updated')
    },
  
    
    globalEvent: function(){
      var func = _.bind(this.close, this)
      $('.modal-backdrop').click(function(){
        func() 
      });
    },
    

    close: function() {
      $(this.el).modal('hide');
      this.remove()
    }

  });

});
