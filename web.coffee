express = require 'express'
app     = express.createServer express.logger()
port    = process.env.PORT || 3000

app.set 'views', "#{__dirname}/views"
app.set 'view options', layout: false

app.use express.static("#{__dirname}/public")

app.get '/', (req, res) ->
    res.render 'index.ejs', levelNumber: 1

app.get '/js', (req, res) ->
    res.render 'index-js.ejs', levelNumber: 1
    
app.get /^\/([0-9]+)$/, (req, res) ->
    res.render 'index.ejs', levelNumber: req.params[0], epic: 0

app.get /^\/js\/([0-9]+)$/, (req, res) ->
    res.render 'index-js.ejs', levelNumber: req.params[0], epic: 0

app.get '/epic', (req, res) ->
    res.render 'index.ejs', epic: true, levelNumber: 1

app.get '/js/epic', (req, res) ->
    res.render 'index-js.ejs', epic: true, levelNumber: 1



app.listen port, =>
  console.log "Listen on #{port}"