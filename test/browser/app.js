var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    port = process.argv[2] || 8888;

var mimeTypes = {
    "html": "text/html",
    "mustache": "text/plain",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "application/javascript",
    "css": "text/css"};

http.createServer(function(req, res) {
  var uri = url.parse(req.url).pathname;
  var parts = uri.split('/')
  if(parts[1] === 'node_modules') 
    var filename = __dirname + '/../..'+uri
  else if(parts[1] === 'js')
    var filename = path.join(__dirname+'/../../public/', uri);
  else
    var filename = path.join(process.cwd(), uri);
  path.exists(filename, function(exists) {
    if(!exists) {
      console.log("not exists: " + filename);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write('404 Not Found\n');
      res.end();
      return
    }
    var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
    res.writeHead(200, {'Content-Type': mimeType} );

    var readStream = fs.createReadStream(filename);

    // This will wait until we know the readable stream is actually valid before piping
    readStream.on('open', function () {
      // This just pipes the read stream to the response object (which goes to the client)
      readStream.pipe(res);
    });

    // This catches any errors that happen while creating the readable stream (usually invalid names)
    readStream.on('error', function(err) {
      res.end(err);
    });

  }); //end path.exists
}).listen(port);
console.log("Static file server running at => http://localhost:" + port + "/\nCTRL + C to shutdown");
