define(function(require) {

var tpl = require('text!templates/reply-form.mustache')
  , Message = require('models/message') 
  , AlertView = require('views/site/alert').alert
  , SellerUserMessage = require('models/seller_user_message')

var longMessage = '<p>Hello,</p> \
                   <p>Thank you for your message. \
                   It may take some time before we get a reply. \
                   However as soon as we do we will, we will contact you.</p>\
                   <p>Thank you,<br>\
                   Ruby</p>'

var shortMsg = 'Message sent'

var Reply = {}

Reply.Reply = Backbone.View.extend({

  template: Hogan.compile(tpl).render(),

  className: 'reply-form',

  events: {
    'submit form' : 'submit'
  },

  initialize: function(options) {
    _.bindAll(this)
    this.user = options.user
    this.context = options.context
    this.subject_id = options.subject_id
    this.convo_id = options.convo_id
    this.parentView = options.parentView
    this.largeButton = options.largeButton ? 'btn-large' : false
    if (options && options.bigTextarea)
      this.bigTextarea = options.bigTextarea
    //this.model = new Message()
    //Backbone.Validation.bind(this);
    //this.model.on("validated:valid", this.valid, this)
    //this.model.on("validated:invalid", this.invalid, this);
  },

  render: function () {
    $(this.el).html(this.template);
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

    $.post(url, data, $.proxy(this.xhr_callback, this) );
  },

  showMessage: function(){
    if (window.firstNoticeShowed == undefined) {
      new AlertView({message: longMessage, duration: 5000, type:"letter", wrapperClass: 'letterWrapper'}) 
      window.firstNoticeShowed = true
    } else {
      new AlertView(shortMsg)
    }
  },

  xhr_callback: function(res) {
    this.showMessage()
    this.parentView.closeReplyForm()
    window.events.trigger("messageAdded-Reply.js", this.parentView, res.data);
  }
})

Reply.Lead = Reply.Reply.extend({
  xhr_callback: function(res) {
    this.render()
    this.showMessage()
    this.collection.add(res.data); 
  }
}) 

Reply.Seller = Reply.Reply.extend({

  template: Hogan.compile(tpl).render({sellerTpl: true}),

  initialize: function(options) {
    _.bindAll(this)
    this.user = options.user
    this.subject_id = options.subject_id
    this.convo_id = options.convo_id
    this.model = new SellerUserMessage();
    Backbone.Validation.bind(this);
  },

  submit: function (e) {
    e.preventDefault()
    var params = this.$('form').serializeObject();
    this.model.set(params)
    if (!this.model.isValid()) return
    var url = '/reply-logged-out/'+this.subject_id
    $.post(url, this.model.toJSON(), $.proxy(this.xhr_callback, this) );

    // log them in
    this.user.set({username: this.model.get('username'),
                   slug: this.model.get('slug') })
  },

  xhr_callback: function(res) {
    this.render()
    this.showMessage()
    this.collection.add(res.data); 
  }
})

return Reply

})
