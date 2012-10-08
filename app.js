var express = require('express')
  , http = require('http')
  , cons = require('consolidate')
  , RedisStore = require('connect-redis')(express)
  , mongo = require('mongoskin')
  , ObjectID = mongo.ObjectID
  , bcrypt = require('bcrypt')
  , imagemagick = require('imagemagick')
  , check = require('validator').check
  , sanitize = require('validator').sanitize
  , nodemailer = require("nodemailer")
 

// setup Backbone models    
Backbone = require('backbone')
_ = require('underscore')
var Validation = require('./public/js/libs/backbone.validation/backbone.validation.js')
_.extend(Backbone.Model.prototype, Backbone.Validation.mixin);
var NewUser = require('./public/js/models/newUser')

var staticServer = express.static(__dirname + '/public')

var smtpTransport = nodemailer.createTransport("SMTP",{
    host: "localhost",
})

var app = exports.app = express();

app.engine('mustache', cons.hogan);

app.configure(function(){
  app.set("trust proxy", true)
  app.set('views', __dirname + '/pages');
  app.set('view engine', 'mustache');
  app.set('view options', { layout: false });
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('shhhh, very secret'));
  app.use(express.session({store: new RedisStore }));
  app.use(app.router);
});

app.use(function(err, req, res, next) {
  if (err.statusCode == 404) {
    res.send({
      success: false, 
      statusCode: err.status, 
      message: 'Page not found'
    });
  }
  email({ 
    subject: 'Error', 
    html: '<p><b>url:</b> '+req.url+'</p><p><b>message:</b> '+err.message+'</p><p>'+err.stack+'</p>'
  })
});

// debug
//app.settings.env = 'production'

app.configure('production', function(){
  app.set('port', process.env.PORT || 8010);
  db = mongo.db('localhost/rubyrate?auto_reconnect');
})

app.configure('staging', function(){
  app.set('port', process.env.PORT || 8011);
  db = mongo.db('localhost/dev_ruby?auto_reconnect');
})

app.configure('development', function(){
  app.use(express.errorHandler());
  app.set('port', process.env.PORT || 8012);
  db = mongo.db('localhost/dev_ruby?auto_reconnect');
});

require ('./routes');

db.bind('messages')
db.bind('subjects')
db.bind('users')

function loadUser(req, res, next) {
  var user = req.session.user;
  if (user) {
    req.user = user;
    next();
  } else {
    next(new Error('Failed to load user'));
  }
}

function andRestrictTo(role) {
  return function(req, res, next) {
    req.session.user.role == role
      ? next()
      : next(new Error('Unauthorized'));
  }
}

function loadSubject(req, res, next) {
  try { 
    var _id = new ObjectID(req.params.id) 
  } catch(err) { 
    return next({statusCode: 404, message: err}) 
  }
  db.subjects.findOne({_id: _id}, function(err, subject) {
    if (subject) {
      req.subject = subject;
      next();
    } else {
      return next({statusCode: 404, message: 'bad object_id'})
    }
  })
}

/* redirect from www */
app.get('/*', function(req, res, next) {
  if (req.headers.host.match(/^www/) !== null ) {
    var new_url = 'http://' + req.headers.host.replace(/^www\./, '') + req.url
    res.redirect(301, new_url);
  }
  else next();
});

app.get('/css/*', function(req, res, next) {
  staticServer(req, res, next)  
})

app.get('/js/*', function(req, res, next) {
  staticServer(req, res, next)  
})

app.get('/img/*', function(req, res, next) {
  staticServer(req, res, next)  
})

app.get('/browser/*', function(req, res, next) {
  var staticServer = express.static(__dirname + '/test')
  staticServer(req, res, next)  
})

app.get('/fonts/*', function(req, res, next) {
  staticServer(req, res, next)  
})

//app.post('/scraper', loadUser, andRestrictTo('admin'), routes.scraper)
//app.post('/*', loadUser, andRestrictTo('admin'), routes.scraper)

/* force xhr */
app.get('/*', function(req, res, next) { 
  if (!(req.xhr)) {
    var locals = { year: new Date().getFullYear() }
    locals.user = req.session.user ? JSON.stringify(req.session.user) : JSON.stringify({})
    if (app.settings.env == 'development') 
      locals.development = true  
    res.render('layout', locals)
  }
  else 
    next()
})


//app.post('/scraper', spider.scraper)  

//app.get('/crawl', spider.crawl)



/*
app.get('/', function(req, res) {
  res.render('home', function(err, html){
    res.send({title: 'Ruby Rate', body: html});
  });
})
*/


app.get('/user', function(req, res){
  res.send(req.session.user) 
})

function setUserSession(req, user){
  var userOmittedData = {
    _id: user._id,
    username: user.username,
    slug: user.slug,
    role: user.role
  }    
  req.session.user = userOmittedData
  return userOmittedData
}

app.post('/session', function(req, res) {

  function isEmailorUsername(){
    var key
    var spec = {}
    try {
      check(req.body.login).isEmail()
      key = 'email'
    } catch(e) {
      key = 'username'
    }
    spec[key] = req.body.login  
    return spec
  }

  var spec = isEmailorUsername(req.body.login)  

  db.collection('users').findOne(spec, function(err, user){
    if (!user)
      return res.send({success: false, message: 'user not found'});
    bcrypt.compare(req.body.password, user.password, function(err, match) {
      if (!match) 
        return res.send({success: false, message: 'user not found'});
      var userData = setUserSession(req, user)
      res.send(userData)
    })
  })
})

app.del('/user', function(req, res) {
  req.session.destroy(function(){
    res.send({success: true, 
              message: 'user logged out'
    })
  })
})


app.get('/signup', function(req, res) { });

app.post('/user', function(req, res){ 
  var user = new NewUser(req.body)
  var errors = user.validate()
  if (errors) 
    res.send({success: false, errors: errors})
  else {
    user.setPassword(function(){
      db.collection('users').insert(user.toJSON(), function(err, result){
        var userData = setUserSession(req, result[0])
        res.send(userData);
      })
    })
  }
})

function isUniqueUsername(username, fn) {
  var username = username.toLowerCase()
  username = username.replace(/^@/, '')  //twitter @
  db.collection('users').findOne({username: username}, function(err, user){
    if (user)
      fn(false)
    else 
      fn(true)
  })
}
module.exports.isUniqueUsername = isUniqueUsername

app.get("/is-unique-username", function(req, res) {
  var username = req.query.username
  isUniqueUsername(username, function(isUnique){
    res.send(isUnique)
  })
})

app.get("/check-email", function(req, res){
  if (req.query.email == '')  return res.send(true)
  var email = req.query.email.toLowerCase()
  db.collection('users').findOne({email: email}, function(err, user){
    return user
      ? res.send(false)
      : res.send(true);
  })
})

app.get('/profile/:slug', function(req, res) {
  db.users.findOne({slug: req.params.slug}, {password: 0, email: 0}, function(err, user) {
    res.send(user)
  })
})

app.get('/profile/:slug/edit', loadUser, function(req, res) {
  db.users.findOne({slug: req.user.slug}, {password: 0}, function(err, user) {
    res.send(user)
  })
})

app.post('/profile', loadUser, function(req, res) {
  db.users.update({username: req.user.username}, {$set: req.body})
  res.send({success: true, message: 'user updated'})
})

app.get('/wishes', function(req, res) {
  db.subjects.find({pending: {$ne: true}}).sort({_id: -1}).toArray(function(err, wishes) {
    if (err) throw err;
    res.send(wishes)
  })
})

app.put('/messages/:id', loadUser, andRestrictTo('admin'), function(req, res) {
  db.messages.update({_id: new ObjectID(req.params.id)}, {$set: {body: req.body.body}})
  res.send({success: true, message: 'messages updated'})
})


function makeShortId() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 5; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

app.post('/wishes-home', function(req, res) {
  req.body.username = req.body.username.trim()
  email({
    subject: 'Homepage wish created', 
    html: '<p>Ip address: '+req.ip+'</p><p>'+req.body.body+'</p>'
  })
  var subject = {
    author : req.body.username,
    authorSlug : req.body.slug,
    body: req.body.body,
    location: req.body.location,
    shortId: makeShortId(),
    users: [{username: req.body.username}]
  }
  //validate next time to make sure you have all the necessary attrs
  var user = new NewUser({
    username: req.body.username,
    password: 'animeeverything',
    contact: req.body.contact,
    slug: req.body.slug
  })
  var test = user.toJSON()
  user.setPassword(function(){
    db.users.insert(user.toJSON())
    db.subjects.insert(subject)
    res.send({success: true, message: 'wish inserted'})
  })
});

app.post('/wishes', loadUser, function(req, res) {
  req.body.shortId = makeShortId() 
  req.body.author = req.user.username
  req.body.authorSlug = req.user.slug
  req.body.users = [{
    username: req.user.username, 
  }]
  db.collection('subjects').insert(req.body, function(err, id){
    if (err) throw err;
    res.send({success: true, message: 'wish inserted'})
  })
});

app.get('/wishes/:id/seller', function(req, res) {
  db.subjects.findOne({_id: new ObjectID(req.params.id)}, function(err, subject) {
    res.send({wish: subject,
              subject_id: req.params.id})
  })
})


app.get('/lead/:id/:slug', function(req, res) {
  db.subjects.findOne({_id: new ObjectID(req.params.id)}, function(err, subject) {
    db.users.findOne({'slug': req.params.slug}, function(err, user){
      setUserSession(req, user)
      var userInArray = _.find(subject.users, function(u){ 
        if (u.username == user.username) return u 
      });
      db.messages.find({convo_id: userInArray.convo_id}).sort({_id:1}).toArray(function(err, messages) {
        messages.unshift(subject)
        res.send({messages: messages,
                  wish: subject,
                  subject_id: req.params.id,   
                  convo_id: userInArray.convo_id})
      })
    })
  })
})


app.get('/helper/:id', function(req, res, next) {
  db.subjects.findOne({shortId: req.params.id}, function(err, subject) {
    if (!subject) 
      return next({statusCode: 404, message: 'bad helper page'})

    // send email
    var html  = '<p>Ip address: '+req.ip+'</p>'
        html += '<p>Viewed for this wish:</p><p>'+subject.body+'</p>'
    email({subject: 'Helper Page Viewed', html: html})

    db.users.findOne({'username': subject.author}, function(err, user){
      setUserSession(req, user)
      var subject_id = subject._id.toHexString() 

        function map() {
          var values = {comments: new Array(this), 
                        count: 1, 
                        modified: this._id.getTimestamp(),
                        unread: this.unread
                        }
          emit(this.convo_id, values);        
        }

        var reduce = function(key, values) {
          var result = {
            comments: new Array(), 
            count: 0,
            modified: '',
            unread: false
          };
          values.forEach(function(value) {
            result.count += value.count;

            if (value.comments.length > 0)
              result.comments = result.comments.concat(value.comments);
            else
              result.comments.push(value.comments[0]) 

            if (value.modified && value.modified > result.modified)
              result.modified = value.modified 
            else
              result.modified = value.modified

            if (value.unread)
              result.unread = true
          });
          return result;
        }

        var options = {
          "query": {subject_id: subject._id.toHexString()}, 
          "sort": {_id: 1},
          "out" : {replace : 'tempCollection'},
        };

        db.messages.mapReduce(map, reduce, options, function(err, collection) {
          collection.find().sort({'value.modified': -1}).toArray(function(err, conversations) {
              if (err) throw err;
              res.send({subject: subject, conversations: conversations})
          })
        })
      })
    })
  })


app.get('/wishes/:id', loadSubject, function(req, res) {
  var subject = req.subject
  function map() {
    emit(this.convo_id, 
    {
      message: this, 
      count: 1 //not sure why doing a count
    });        
  }

  var reduce = function(key, values) {
    var res = {message: '', 
               count: 0};
    values.forEach(function(value) {
      res.count += value.count;
      if (!res.message) 
        res.message = value.message 
    });
    return res;
  }

  var options = {
    "query": {subject_id: subject._id.toHexString()}, 
    "sort": {_id: 1}, //find the messages in order, bc the 2nd one gets dropped in finalize
    "out" : {replace : 'tempCollection'},
  };

  db.messages.mapReduce(map, reduce, options, function(err, collection) {
    // the sort gets them in order of last modified
    collection.find().sort({'value.message._id': -1}).toArray(function(err, results) {
        if (err) throw err;
        var messages = []
        results.forEach(function(result) { //folding values into one object
          result.value.message.count = result.value.count - 1 //bc u are showing the first message so you need a number for the others
          messages.push(result.value.message)  
        })
        res.send({subject: subject, messages: messages})
    })
  })
})

app.get('/wishes/:id/contacted-companies', loadUser, andRestrictTo('admin'), function(req, res) {
  db.subjects.findOne({_id: new ObjectID(req.params.id)}, {users:0}, function(err, subject) {
    res.send({
      subject: subject, 
      contacted: subject.contacted || [] 
    })
  })
})

app.post('/wishes/:id/contacted-companies', loadUser, andRestrictTo('admin'), function(req, res) {
  req.body._id = new ObjectID() 
  db.subjects.update({_id: new ObjectID(req.body.subject_id)}, {$push: {contacted: req.body}}) 
  res.send(req.body)
})

app.put('/wishes/:subject_id/contacted-companies/:id', loadUser, andRestrictTo('admin'), function(req, res) {
  //maybe make faster by querying for subject_id first
  delete req.body._id
  db.subjects.update({_id: new ObjectID(req.params.subject_id),
                      'contacted._id': new ObjectID(req.id)}, 
    {$set: {'contracted.$': req.body}}, {safe:true}, function(err, doc){
    console.log(err)     
  }) 
  res.send(req.body)
})



/* add restrict to role */
app.post('/halfUser/:id', loadUser, function(req, res) {
  var username = req.user.username
  db.users.update({username: username}, {$set: req.body})
  res.send({success: false, message: 'user updated'})
})

app.get('/subjects/:id', loadUser, function(req, res) {
  var username = req.user.username

  // reset unread
  db.subjects.update(
    {_id: new ObjectID(req.params.id), 'users.username': username }, 
    {$set: {'users.$.unread': 0}}
  ) 
  var query =  {
    _id: new ObjectID(req.params.id), 
    'users.username': username 
  }
  db.subjects.findOne(query, function(err, subject) {
      if (err) throw err;
      // TODO test this following authorization
      if (!subject)
        res.send({success: false, message: 'user unauthorized'})
      if (username == subject.author) {

        function map() {
          var values = {comments: new Array(this), count: 1}
          emit(this.convo_id, values);        
        }
        //var map = function() {
        //} 

        var reduce = function(key, values) {
          var result = {comments: new Array(), count: 0};
          values.forEach(function(value) {
            result.count += value.count;
            if (value.comments.length > 0)
              result.comments = result.comments.concat(value.comments);
            else
              result.comments.push(value.comments[0]) 
          });
          return result;
        }

        var options = {
          "query": {subject_id: req.params.id}, 
          "sort": {_id: 1 },
          "out" : {replace : 'tempCollection'},
        };

        db.messages.mapReduce(map, reduce, options, function(err, collection) {
          collection.find().toArray(function(err, conversations) {
              if (err) throw err;
              res.send({subject: subject, conversations: conversations})
          })
        })
      }

      else {
        var user = _.find(subject.users, function(user){ return user.username == username });

        db.messages.find({convo_id: user.convo_id}).toArray(function(err, conversations) {
          if (err) throw err;
          res.send({
            subject: subject, 
            single_convo: true, 
            conversations: conversations
          })
        })
      }
  })
})

app.get('/subjects', loadUser, function(req, res) {
  var username = req.user.username
  db.subjects.find({'users.username': username}).toArray(function(err, subjects) {
    var arr = new Array()
    _.each(subjects, function(subject) {
      var user = _.find(subject.users, function(user){ return user.username == username })
      delete subject.users 
      subject.total = user.total
      subject.unread = user.unread
      arr.push(subject)
    });
    res.send(arr)
  })
})

app.post('/wishes/:id/messages', function(req, res) {
  var convo_id = new ObjectID().toString()

  var user = {
    username: req.body.username, 
    convo_id: convo_id,
    total: 1
  } 

  db.subjects.update({_id: new ObjectID(req.params.id)}, {$push: {users: user}, $set:{modified: new Date() }}) 
  db.subjects.update({_id: new ObjectID(req.params.id)}, {$inc: {'users.0.unread': 1, 'users.0.total': 1}}) 


  var message = req.body 
  message.convo_id = convo_id
  message.author = username
  message.authorSlug = req.body.username.replace(/[^a-zA-z0-9_\-]+/g, '-').toLowerCase()
  message.subject_id = req.params.id
  message.label = ['first'] 
  db.messages.insert(message, function(err, message){
    if (err) throw err;
    res.send({success: true, message: 'message inserted', data: message[0]})
  })

})


app.post('/reply-logged-out/:id', function(req, res) {
  var username = req.body.username
  var slug = new NewUser().setSlug(username)
  var convo_id = new ObjectID().toString()

  var user = {
    username: username, 
    convo_id: convo_id,
    total: 1
  } 

  db.subjects.update({_id: new ObjectID(req.params.id)}, {$push: {users: user}, $set:{modified: new Date() }})
  db.subjects.update({_id: new ObjectID(req.params.id)}, {$inc: {'users.0.unread': 1, 'users.0.total': 1}}) 

  var message = {}
  message.body = req.body.body 
  message.convo_id = convo_id
  message.author = username
  message.authorSlug = slug
  message.subject_id = req.params.id
  message.label = ['first'] 
  db.messages.insert(message, function(err, message){
    if (err) throw err;
    res.send({success: true, message: 'message inserted', data: message[0]})
  })


  // email
  db.subjects.findOne({_id: new ObjectID(req.params.id)}, function(err, subject) {
    var html = '<h1>First reply to wish</h1><p><b>author:</b>'+message.author+'</p><h3>Message</h3><p>'+message.body+'</p>'
        html += '<h2>In response to this wish</h2><p>'+subject.body+'</p>'
    email({subject: 'First reply from seller page', html: html})
  })

})



app.post('/first-reply/:id', loadUser, function(req, res) {
  var username = req.user.username
  var convo_id = new ObjectID().toString()

  var user = {
    username: username, 
    convo_id: convo_id,
    total: 1
  } 

  db.subjects.update({_id: new ObjectID(req.params.id)}, {$push: {users: user}, $set:{modified: new Date() }}) 
  db.subjects.update({_id: new ObjectID(req.params.id)}, {$inc: {'users.0.unread': 1, 'users.0.total': 1}}) 

  var message = req.body 
  message.convo_id = convo_id
  message.author = username
  message.authorSlug = req.user.slug
  message.subject_id = req.params.id
  message.label = ['first'] 
  db.messages.insert(message, function(err, message){
    if (err) throw err;
    res.send({success: true, message: 'message inserted', data: message[0]})
  })


  // email
  db.subjects.findOne({_id: new ObjectID(req.params.id)}, function(err, subject) {
    var html = '<h1>First reply to wish</h1><p><b>author:</b>'+message.author+'</p><h3>Message</h3><p>'+message.body+'</p>'
        html += '<h2>In response to this wish</h2><p>'+subject.body+'</p>'
    email({subject: 'First reply from wishes page', html: html})
  })

})

app.post('/reply/:convo_id', loadUser, function(req, res) {
  var username = req.user.username
    , msg = req.body
    , convo_id = req.params.convo_id

  msg.convo_id = convo_id
  msg.author = username
  msg.authorSlug = req.user.slug
  db.messages.insert(req.body, function(err, msg){
    if (err) throw err;
    res.send({success: true, message: 'message inserted', data: msg[0]})
  })
  
  db.subjects.findOne({_id: new ObjectID(msg.subject_id)}, function(err, subject){
    var to = _.find(subject.users, function(user){ return user.convo_id == convo_id })
    if (subject.author == username) {
      db.subjects.update({_id: new ObjectID(msg.subject_id), 'users.username': to.username }, 
        {$inc: {'users.$.unread': 1, 'users.$.total': 1, 'users.0.total': 1},
         $set: {modified: new Date()}}
      ) 
    } else {
      db.subjects.update(
        {_id: new ObjectID(msg.subject_id), 'users.username': to.username}, 
        {$inc: {'users.0.unread': 1, 'users.0.total': 1, 'users.$.total': 1},
         $set: {modified: new Date()}}
      )   
    }
    var html = '<h1>Reply</h1><p><b>author:</b>'+msg.author+'</p><h3>Message</h3><p>'+msg.body+'</p>'
        html += '<h2>In response to this wish</h2><p>'+subject.body+'</p>'
    email({subject: 'Reply from special page', html: html})

  })

/*
    if author is me, send to person matching the convo_id
    i'm = 'xaevir' 
    author = 'xaevir' 
    users = [
      {username: 'jen',
       convo_id: 12334
      } 
    ] 
    if author is not me, send to author
    i'm = 'jen' 
    author = 'xaevir' 
    users = [
      {username: 'xaevir',
      },
      {username: 'jen',
       convo_id: 12334
      }
    ]
*/  
})

function email(opts) {
  if (app.settings.env === 'development')
    return console.log(opts.html)

  var message = {
      from: 'Website <website@rubyrate.com>',
      // Comma separated list of recipients
      to: 'bobby.chambers33@gmail.com',
  }
  message.subject = opts.subject
  message.html = opts.html

  smtpTransport.sendMail(message, function(error, response){
    if(error)
      console.log(error);
    else
      console.log("Email sent: " + response.message);
    smtpTransport.close(); // shut down the connection pool, no more messages
  })
}

var server = http.createServer(app) 
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on('connection', function (socket) {
  socket.on('start scraper', function (data) {
    var spider = new Spider()
    spider.spider(data, socket)
  });
})
//io.sockets.on('startCrawling', function(spider.crawl) 
