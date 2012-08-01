define(function(require) {

var tpl = require('text!templates/reply-form.mustache')
  , Message = require('models/message') 
  , AlertView = require('views/site/alert')

var ReplyView = Backbone.View.extend({

  template: Hogan.compile(tpl).render(),
  
  className: 'reply-form',

  events: {
    //'keyup :input': 'setAttr',
    //'paste :input': 'onPaste',
    'submit form' : 'submit'
  },

  onPaste: function(el){
    var setAttr = this.setAttr
    setTimeout(function(){setAttr(el)}, 100)
  },

  button: '',

  initialize: function(options) {
    _.bindAll(this)
    this.user = options.user
    this.context = options.context
    this.subject_id = options.subject_id
    this.convo_id = options.convo_id
    this.parentView = options.parentView
    if (options && options.bigTextarea)
      this.bigTextarea = options.bigTextarea
    //this.model = new Message()
    //Backbone.Validation.bind(this);
    //this.model.on("validated:valid", this.valid, this)
    //this.model.on("validated:invalid", this.invalid, this);
  },

  reset: function() {
    //this.model.off()
    //this.model.clear()
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
    if (this.bigTextarea) {
      var tArea = $('textarea', this.el) 
      tArea.wysihtml5({
        "font-styles": false, //Font styling, e.g. h1, h2, etc. Default true
        "emphasis": true, //Italics, bold, etc. Default true
        "lists": false, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
        "html": true, //Button which allows you to edit the generated HTML. Default false
        "link": true, //Button to insert a link. Default true
        "image": false //Button to insert an image. Default true
      });
    } else {
      var tArea = $('textarea', this.el) 
      tArea.wysihtml5({
        "font-styles": false, //Font styling, e.g. h1, h2, etc. Default true
        "emphasis": true, //Italics, bold, etc. Default true
        "lists": false, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
        "html": false, //Button which allows you to edit the generated HTML. Default false
        "link": true, //Button to insert a link. Default true
        "image": false //Button to insert an image. Default true
      });
    }
    /*    
    var textarea = $('textarea', this.el)
    var t = setTimeout(function(){
      textarea.focus()
    }, 500);
    */
    return this
  },

  submit: function (e) {
    e.preventDefault()
    var tArea = $('#textarea-modal')
    if (tArea.val() == '') return
    var self = this
    var data = {}
    data.author = this.user.get('username'),
    data.subject_id = this.subject_id,
    data.body =  tArea.val() 
    
    if (this.context == 'wish') 
      var url = '/first-reply/' + this.subject_id
    else
      var url = '/reply/' + this.convo_id

    $.post(url, data, function(res) {
      //self.collection.add(res.data)
      var msg  = '<p>Hello,</p>'
          msg += '<p>Thank you for your message. '
          msg += 'It may take some time before we get a reply. ' 
          msg += 'However as soon as we do we will, we will contact you.</p>'
          msg += '<p>Thank you,<br>'
          msg += 'Ruby</p>'

      var shortMsg = 'Message sent'

      if (window.firstNoticeShowed == undefined) {
        new AlertView({message: msg, duration: 5000, type:"letter", wrapperClass: 'letterWrapper'}) 
        window.firstNoticeShowed = true
      } else 
        new AlertView(shortMsg)
      //self.render()
      self.parentView.closeReplyForm()
      $('#textarea-modal').val('')
      window.events.trigger("messageAdded-Reply.js", self.parentView, res.data);
    // only one reply allowed
    //if (this.context == 'wish') 
    //  this.parentView.closeReplyForm() 
    });
  },
})

return ReplyView

})
