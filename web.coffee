# var express = require('express');
# 
# var app = express.createServer(express.logger());
# var port = process.env.PORT || 3000;
# 
# app.set('views', __dirname + '/views');
# 
# app.listen(port, function() {
#   console.log("Listening on " + port);
# });

express = require 'express'
app     = express.createServer express.logger()
port    = process.env.PORT || 3000

app.set 'views', "#{__dirname}/views"
app.use express.static("#{__dirname}/public")
app.listen port, =>
  console.log "Listen on #{port}"