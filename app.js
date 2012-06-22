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
  , _ = require('underscore')
  , nodemailer = require("nodemailer")

var staticServer = express.static(__dirname + '/public')

var smtpTransport = nodemailer.createTransport("SMTP",{
    host: "localhost",
})

var app = express();

app.engine('mustache', cons.hogan);

app.configure(function(){
  app.set('views', __dirname + '/pages');
  app.set('view engine', 'mustache');
  app.set('view options', { layout: false });
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('robin'));
  app.use(express.session({ secret: "batman", store: new RedisStore }));
  app.use(app.router);
  app.use(error);
});

function error(err, req, res, next) {
  var html = '<h2>Error</h2><p>'+err.message+'</p>'
  var opts = { subject: 'Error', html: html }
  email(opts)
  next(err);
}

app.configure('development', function(){
  app.use(express.errorHandler());
  db = mongo.db('localhost/dev_ruby?auto_reconnect');
});

app.configure('production', function(){
  db = mongo.db('localhost/rubyrate?auto_reconnect');
})

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

app.get('/fonts/*', function(req, res, next) {
  staticServer(req, res, next)  
})

/* force xhr */
app.get('/*', function(req, res, next) { 
  if (!(req.xhr)) {
    var locals = { year: new Date().getFullYear() }
    if (app.settings.env == 'development') 
      locals.development = true  
    res.render('layout', locals)
  }
  else 
    next()
})

app.get('/', function(req, res) {
  res.render('home', function(err, html){
    res.send({title: 'Ruby Rate', body: html});
  });
})

app.get('/user', function(req, res){
  res.send(req.session.user) 
})

function setUser(req, user){
  var userOmittedData = {
    _id: user._id,
    username: user.username,
    slug: user.slug,
    role: user.role
  }    
  req.session.user = userOmittedData
  return userOmittedData
}

app.post('/login', function(req, res) {

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
      return res.send({message: 'user not found'});
    bcrypt.compare(req.body.password, user.password, function(err, match) {
      if (!match) 
        return res.send({message: 'user not found'});
      var userData = setUser(req, user)
      res.send(userData)
    })
  })
})

app.del('/session', function(req, res) {
  req.session.destroy(function(){
    res.send({success: true, 
              message: 'user logged out'
    })
  })
})


app.get('/signup', function(req, res) { });

app.post('/signup', function(req, res){ 
  // slug 
  req.body.slug = req.body.username.replace(/[^a-zA-z0-9_\-]+/g, '-').toLowerCase()
  req.body.email = req.body.email.toLowerCase() 
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(req.body.password, salt, function(err, hash){
      req.body.password = hash;
      db.collection('users').insert(req.body, function(err, result){
        var user = result[0]
        var userData = setUser(req, user)
        res.send(userData);
      })
    })
  }) 
})

app.get("/is-username-valid", function(req, res) {
  var username = req.query.username
  username = username.toLowerCase()
  db.collection('users').findOne({username: username}, function(err, user){
    return user 
      ? res.send(false) 
      : res.send(true);
  })
})

app.get("/check-email", function(req, res){
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
  db.collection('subjects').find().sort({_id: -1}).toArray(function(err, wishes) {
    if (err) throw err;
    for (i=0; i<wishes.length; i++) {
      wishes[i] = new Array(wishes[i])
    }
    //_.map(wishes, function(wish){ return new Array(wish) });
    res.send(wishes)
  })
})

function makeShortId() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 5; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

app.post('/wishes', loadUser, function(req, res) {
  //slug
  
  // str = sanitize(large_input_str).xss();
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

app.get('/lead/:id/:slug', function(req, res) {
  db.subjects.findOne({_id: new ObjectID(req.params.id)}, function(err, subject) {
    db.users.findOne({'slug': req.params.slug}, function(err, user){
      setUser(req, user)
      db.messages.find({
                      subject_id: subject._id.toHexString(), 
                      label: 'first', 
                      author:{$ne: user.username } })
                      .toArray(function(err, otherMessages) {
        var userInArray = _.find(subject.users, function(u){ 
          if (u.username == user.username) return u 
        });
        db.messages.find({convo_id: userInArray.convo_id}).toArray(function(err, messages) {
          res.send({
                  subject: subject, 
                  otherMessages: otherMessages,
                  messages: messages})
        })
      })
    })
  })
})


app.get('/helper/:id', function(req, res) {

  db.subjects.findOne({shortId: req.params.id}, function(err, subject) {
    // send email
    var html = '<h1>Special page</h1>'
        html += '<h2>In response to this wish</h2><p>'+subject.body+'</p>'
    email({subject: 'Somebody checked out the special page', html: html})

    db.users.findOne({'username': subject.author}, function(err, user){
      setUser(req, user)
      var subject_id = subject._id.toHexString() 

        function map() {
          var values = {comments: new Array(this), count: 1, modified: this._id.getTimestamp()}
          emit(this.convo_id, values);        
        }

        var reduce = function(key, values) {
          var result = {
            comments: new Array(), 
            count: 0,
            modified: ''
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

app.get('/wishes/:id', function(req, res) {
  db.subjects.findOne({_id: new ObjectID(req.params.id)}, function(err, subject) {
    function map() {
      var values = {comments: new Array(this), count: 1}
      emit(this.convo_id, values);        
    }

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

    var finalize = function(key, value){
      if (value.comments.length > 0) 
          value.comments = new Array(value.comments[0])
        return value;
    }

    var options = {
      "query": {subject_id: subject._id.toHexString()}, 
      "sort": {_id: 1 },
      "out" : {replace : 'tempCollection'},
      "finalize": finalize
    };

    db.messages.mapReduce(map, reduce, options, function(err, collection) {
      collection.find().toArray(function(err, conversations) {
          if (err) throw err;
          res.send({subject: subject, conversations: conversations})
      })
    })
  })
})

app.get('/wishes/:id/setup', loadUser, function(req, res) {
  db.subjects.findOne({_id: new ObjectID(req.params.id)}, function(err, wish) {
    db.users.find({wish_id: req.params.id}).toArray(function(err, halfUsers) {
      if (err) throw err;
      res.send({
        wish: wish, 
        halfUsers: halfUsers
      })
    })
  })
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
   email
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


var server = http.createServer(app).listen(8010);

console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
