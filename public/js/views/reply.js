define(function(require) {

var tpl = require('text!templates/reply.mustache')
  , Message = require('models/message') 
  , AlertView = require('views/site/alert')

var ReplyView = Backbone.View.extend({

  className: 'reply-unit',

  template: Hogan.compile(tpl).render(),

  events: {
    'keyup :input': 'setAttr',
    'paste :input':  'onPaste',
    'submit form' : 'submit'
  },

  onPaste: function(el){
    var setAttr = this.setAttr
    setTimeout(function(){setAttr(el)}, 100)
  },

  button: '',

  initialize: function(options) {
    _.bindAll(this, 'render', 'submit', 'setAttr', 'reset')
    this.convo_id = options.convo_id
    this.subject_id = options.subject_id
    this.model = new Message()
    Backbone.Validation.bind(this);
    this.model.on("validated:valid", this.valid, this)
    this.model.on("validated:invalid", this.invalid, this);
  },

  reset: function() {
    //this.model.off()
    this.model.clear()
    this.render()
  },

  setAttr: function(e) {
    var field = $(e.currentTarget);
    var name = field.attr('name');
    var value = field.val();
    var attr = {};
    attr[name] =value
    this.model.set(attr)
  },
 
  valid: function(model) {
    this.button.removeAttr('disabled');
  },

  invalid: function(model) {
    if (this.button.attr('disabled')) return
    this.button.attr('disabled', 'true')
  },

  render: function () {
    $(this.el).html(this.template);
    this.button = $('button[type="submit"]', this.el);
    var textarea = $('textarea', this.el)
    var t = setTimeout(function(){
      textarea.focus()
    }, 500);
    return this
  },

  submit: function (e) {
    e.preventDefault()
    var self = this
    var data = {
      author: window.user.get('username'),
      subject_id: this.subject_id,
      body: this.model.get('body')
    }
    if (this.convo_id) 
      var url = '/reply/' + this.convo_id
    else
      var url = '/first-reply/' + this.subject_id

    $.post(url, data, function(res) {
      self.collection.add(res.data)
      self.reset()
      self.notice('Message sent')
    });
  },

  notice: function(msg){
    var successAlert = new AlertView({
      message: '<strong>'+msg+'</strong>',
      type: 'info'
    })
    successAlert.fadeOut()
  },


})

return ReplyView

})
