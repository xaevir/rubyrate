define(function(require) {

var SignupView = require('views/users/signup')
  , homeTpl = require('text!templates/home.mustache')
  , LoginView = require('views/users/login')         
  , SubjectsNav = require('views/subjects_nav')
  , Wishes = require('collections/wishes')
  , Subjects = require('collections/subjects')
  , Subject = require('models/subject')
  , ChatColumns = require('views/chatColumns')
  , MessageBodyView = require('views/messageBody')
  , MessagesView = require('views/messages')
  , ProfileView = require('views/users/profile')
  , ProfileEditView = require('views/users/profile-edit')
  , ProfileMenuView = require('views/profile-menu')
  , WishSetupView = require('views/wishes/setup')
  , ChatCompositeView = require('views/chatComposite')         
  , ReplyView = require('views/reply')
  , instructionsTpl = require('text!templates/instructions.mustache')
  , UserMenu = require('views/user-menu')
  , User = require('models/user')
  , NewUser = require('models/newUser')
  , MainMenu = require('views/main-menu')         

function showStatic(path) {
  $.get(path, function(obj) {
    $('#app').html(obj.body);
     document.title = obj.title;
  });
}


var rp = Backbone.Router.prototype
var _route = rp.route;
rp.route = function(route, name, callback) {
  return _route.call(this, route, name, function() {
    //this.trigger.apply(this, ['beforeroute:' + name].concat(_.toArray(arguments)));
    this.reset(name)
    callback.apply(this, arguments);
  });
};

/*
var rp = Backbone.Router.prototype
rp.routeWithoutEvents = rp.route
rp.route = function(route, name, handler){
  var that = this
  this.routeWithoutEvents(route, name, function(){
    that.trigger("route:before")
    handler()
    that.trigger("route:after")
  })
}
*/

var AppRouter = Backbone.Router.extend({

  initialize: function() {
    _.bindAll(this); 
    this.on('all', this.highlight)
    this.getUser()
    window.events = _.clone(Backbone.Events)
    window.dispatcher.on('session:logout', this.logout, this)
    this.router = new Backbone.Router()

    events.on("messageAdded-Reply.js", function(chatCompositeView, message) {
      chatCompositeView.messagesView.addOne(message)
    }); 

    var self = this
    events.on("wishCreated-create_wish.js", function() {
      self.navigate('wishes', {trigger: true})
    });

  },

  routes: {
      'signup':                     'signup'
    , 'login':                      'login'
    , 'how-it-works':               'how_it_works'
    , 'profile/:usernameBackbone.Router':          'profile'
    , 'profile/:username/edit':     'profile_edit'
    , 'wishes':                     'wishes' 
    , 'wishes/:id':                 'wish' 
    , 'helper/:id':                 'helper' 
    , 'wishes/:id/setup':           'wish_setup' 
    , 'subjects':                   'subjects'
    , 'subjects/:id':               'subject'
    , 'lead/:id/:slug':             'lead'
    , 'spider':                     'spider'
    , '':                           'home'
    , 'admin':                      'admin'
    , '*actions':                     'notFound'
  },
}) 

AppRouter.prototype.notFound = function(){
  $('#app').html('<h1>404: This url was not found</h1>')
}

AppRouter.prototype.getUser = function(){
  var user = new User(window.user) 
  this.user = user
  var mainMenu = new MainMenu({ el: $("#main-menu"), user: user});
  mainMenu.render()
  var userMenu = new UserMenu({ el: $("#user-menu"), model: user})
  userMenu.render()
  // logo click
  $("#main-nav .brand").click(function(e) {
    e.preventDefault() 
    var linkEl = $(e.currentTarget);
    var href = linkEl.attr("href");
    var router = new Backbone.Router();
    router.navigate(href.substr(1), true)
  });
}

AppRouter.prototype.reset = function(route, section) {
  route = route.replace('route:', '');
  if(this.prev_route)
    if(_.has(this, 'reset_'+this.prev_route)){
      var path = 'reset_'+this.prev_route 
      this[path]()
    }
  this.prev_route = route
}

AppRouter.prototype.how_it_works = function() { 
  var template = Hogan.compile(homeTpl)
  $('#app').html(template.render())
  _gaq.push(['_trackPageview', '/home'])
  document.title = 'Ruby Rate' 
}

AppRouter.prototype.spider = function(){
  this.view = new View({context: 'main'})
  this.view.render()
  $('#app').html(this.view.el)
  document.title = 'Spider'
  _gaq.push(['_trackPageview', '/spider'])
}

AppRouter.prototype.subjects = function(){
  $('body').addClass('app')
  this.wishNavIsSet = true
  $.get('/subjects', function(res) {
    var view = new SubjectsNav()
    $('#app').html(view.render(res));
    document.title = 'Topics';
  });
}

AppRouter.prototype.reset_subjects = function(){
  $('body').removeClass('app')
}

AppRouter.prototype.subject = function(id) {
  $('body').addClass('app')
  if (!this.wishNavIsSet)
    return this.router.navigate('subjects', {trigger: true})
  var self = this
  $.get('/subjects/'+id, function(res) {
    // header
    var header = new MessageBodyView({message: res.subject, tagName: 'h1', user: this.user})
    var header_html = header.render().el
    $('#conversations #header').html(header_html)

    // body
    var views = []
    _.each(res.conversations, function(convo){
      var chatCompositeView = new ChatCompositeView({user: self.user})
      chatCompositeView.messagesView = new MessagesView({messagesOfChat: convo.value.comments, user: self.user})
      var opts = {
        convo_id: convo._id,
        subject_id: convo.value.comments[0].subject_id,
        parentView: chatCompositeView,
        user: self.user
      }
      chatCompositeView.replyView = new ReplyView(opts)
      views.push(chatCompositeView);
   }, this);
    var view = new ChatColumns({views: views, columns: 2})
    $('#conversations #body').html(view.render().el);
    document.title = 'Ruby Rate';
  });
}

AppRouter.prototype.reset_subject = function(){
  $('body').removeClass('app')
}

AppRouter.prototype.wishes = function(e) {
  var self = this
  $.get('/wishes', function(wishes) {
    var views = []
    _.each(wishes, function(wish){
      var subject_id = wish[0]._id
      var chatCompositeView = new ChatCompositeView({bigTextarea: true, user: self.user})
      chatCompositeView.messagesView = new MessagesView({messagesOfChat: wish, truncate: 200, user: self.user})
      chatCompositeView.replyView = new ReplyView({subject_id: subject_id, 
                                                   parentView: chatCompositeView, 
                                                   context: 'wish',
                                                   bigTextarea: true,
                                                   user: self.user})
      $(chatCompositeView.el).prepend('<a class="view-reply" href="/wishes/' + subject_id + '">view replies</a>')
      // change to user.role =admin

      views.push(chatCompositeView);
   }, this);
    var view = new ChatColumns({views: views})
    var html =  view.render().el
    $('#app').html(html);
    _gaq.push(['_trackPageview', '/wishes'])
    document.title = 'Wishes';
  });
}

AppRouter.prototype.wish = function(id) {
  $('body').attr('id','wish')
  var self = this
  $.get('/wishes/'+id, function(res) {
    // header
    var header = new MessageBodyView({message: res.subject, tagName: 'h1', user: self.user})
    $('#app').html(header.render().el);
    // body
    var views = []
    _.each(res.conversations, function(convo){
      var chatCompositeView = new ChatCompositeView({noReply: true, user: self.user})
      chatCompositeView.messagesView = new MessagesView({messagesOfChat: convo.value.comments, user: self.user})
      var opts = {
        convo_id: convo._id,
        subject_id: convo.value.comments[0].subject_id,
        parentView: chatCompositeView,
        user: self.user
      }
      chatCompositeView.replyView = new ReplyView(opts)
      views.push(chatCompositeView);
   }, this);
    var view = new ChatColumns({views: views, columns: 2, span: 6})
    var html =  view.render().el
    $('#app').append(html);
    _gaq.push(['_trackPageview', '/wishes/'+ res.subject.body])
    document.title = 'Wish';
  });
}

AppRouter.prototype.reset_wish = function(){
  $('body').removeAttr('id')
}

AppRouter.prototype.lead = function(id, slug) {
  var self = this

  $.get('/lead/'+id+'/'+slug, function(res) {
    self.getUser()
    // Instructions
    var template = Hogan.compile(instructionsTpl)
    $('#app').html(template.render());
    // header
    var header = '<h2 style="float:left;margin-right: 10px">Your convo with this wish:</h2><h1>'+ res.subject.body+'</h1>'
    $('#app').append(header);
    // Convo 
    var chatCompositeView = new ChatCompositeView({id:'lead-chat', user: self.user})
    chatCompositeView.messagesView = new MessagesView({messagesOfChat: res.messages, user: self.user})
    var opts = {
      convo_id: res.messages[0].convo_id,
      subject_id: res.messages[0].subject_id,
      parentView: chatCompositeView,
      user: self.user
    }
    chatCompositeView.replyView = new ReplyView(opts)
    var html = chatCompositeView.render().el
    $('#app').append(html);

    // otherMessage
    var header = '<h1>Other people that replied to this wish:<h1>'
    $('#app').append(header);

    var views = []
    _.each(res.otherMessages, function(message){
      var chatCompositeView = new ChatCompositeView({noReply: true, user: self.user})
      chatCompositeView.messagesView = new MessagesView({messagesOfChat: message, user: self.user})
      var opts = {
        convo_id: message._id,
        subject_id: message.subject_id,
        parentView: chatCompositeView,
        user: self.user
      }
      chatCompositeView.replyView = new ReplyView(opts)
      views.push(chatCompositeView);
   }, this);
    var view = new ChatColumns({views: views, columns: 3})
    var html =  view.render().el
    $('#app').append(html);
    $.each($('.scrollable'), function(index, ul) { 
      var height = ul.scrollHeight
      ul.scrollTop = height
    });
    _gaq.push(['_trackPageview', '/lead/'+ res.subject.body])
    document.title = 'helper';

  })
}


AppRouter.prototype.helper = function(id) {
  var self = this
  $('body').attr('id','wish')
  $.get('/helper/'+id, function(res) {
    self.getUser()
    // Instructions
    var template = Hogan.compile(instructionsTpl)
    $('#app').html(template.render());

    // header
    var header = '<h2 style="float:left;margin-right: 10px">Your wish was:</h2><h1>'+ res.subject.body+'</h1>'
    $('#app').append(header);
    // body
    var views = []
    _.each(res.conversations, function(convo){
      var chatCompositeView = new ChatCompositeView({user: self.user})
      chatCompositeView.messagesView = new MessagesView({messagesOfChat: convo.value.comments, user: self.user})
      var opts = {
        convo_id: convo._id,
        subject_id: convo.value.comments[0].subject_id,
        parentView: chatCompositeView,
        user: self.user
      }
      chatCompositeView.replyView = new ReplyView(opts)
      views.push(chatCompositeView);
   }, this);
    var view = new ChatColumns({views: views, columns: 2, span: 6})
    var html =  view.render().el
    $('#app').append(html);
    $.each($('.scrollable'), function(index, ul) { 
      var height = ul.scrollHeight
      ul.scrollTop = height
    });
    _gaq.push(['_trackPageview', '/helper/'+ res.subject.body])
    document.title = 'helper';
  });
}

AppRouter.prototype.reset_helper = function(){
  $('body').removeAttr('id')
}


AppRouter.prototype.wish_setup = function(id) {
  $.get('/wishes/'+id+'/setup', function(res) {
    // header
    var wishHeader = new MessageBodyView({message: res.wish, tagName: 'h1', user: this.user})
    $('#app').html(wishHeader.render().el);

    // body
    var view = new WishSetupView(res)
    $('#app').append(view.render().el);

    document.title = 'Ruby Rate';
  });
}

AppRouter.prototype.profileMenu = function(userSlug){
  if (window.user.isLoggedIn()){ 
    if (window.user.get('slug') == userSlug){
      this.profileMenuView = new ProfileMenuView()
      var template = this.profileMenuView.render().el
      $('#main-menu').after(template)
    }
  }
}

AppRouter.prototype.profile = function(userSlug){
  this.profileMenu(userSlug) 
  $.get('/profile/'+userSlug, function(user) {
    var view = new ProfileView(user)
    $('#app').html(view.render(user).el)
    _gaq.push(['_trackPageview', '/profile/'+ user.slug])
    document.title = user.username + ' on Rubyrate'
  })
}

AppRouter.prototype.reset_profile = function(){
  if (this.profileMenuView)
    this.profileMenuView.remove()
}

AppRouter.prototype.profile_edit = function(username){
  $.get('/profile/'+username+'/edit', function(user) {
    var view = new ProfileEditView()
    $('#app').html(view.render(user).el)
    _gaq.push(['_trackPageview', '/profile/'+ user.slug+'/edit'])
    document.title = 'Editing '+user.username+ ' on Rubyrate'
  })
}

AppRouter.prototype.alreadyLoggedIn = function(callback) { 
  if (this.user.isLoggedIn()) 
    return this.navigate('/', true) 
  callback.apply(this, Array.prototype.slice.call(arguments,1)); 
}


AppRouter.prototype.restrict = function(callback) { 
  if (!this.user.isLoggedIn()) 
    return this.navigate('/login', true)
  callback.apply(this, Array.prototype.slice.call(arguments,1)); 
}

AppRouter.prototype.login = _.wrap(function(){
    this.loginView = new LoginView({context: 'main', user: this.user})
    this.loginView.render()
    $('#app').html(this.loginView.el)
    document.title = 'Login'
    _gaq.push(['_trackPageview', '/login'])
  }, AppRouter.prototype.alreadyLoggedIn)

AppRouter.prototype.signup = _.wrap(function(){ 
    this.signupView = new SignupView({
      model: new NewUser(), 
      context: 'main',
      user: this.user
    })
    this.signupView.render();
    $('#app').html(this.signupView.el)
    document.title = 'Sign Up'
    _gaq.push(['_trackPageview', '/signup'])
  }, 
  AppRouter.prototype.alreadyLoggedIn
),

AppRouter.prototype.highlight = function(route, section) {
  route = route.replace('route:', '/');
  if (route === '/home') route = '/' 
  var hrefString = "a[href='" + route + "']"
  var el = $(hrefString, '.navbar');
  if (el.parent().hasClass('active')) return
  else {
    $('.navbar li.active').removeClass('active');
    var parent = el.parent(); 
    if (route== '/') return 
    parent.addClass('active');
  }
}

return AppRouter
});
