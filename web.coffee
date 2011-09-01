express = require 'express'
app     = express.createServer express.logger()
port    = process.env.PORT || 3000

app.set 'views', "#{__dirname}/views"
app.set 'view options', layout: false

app.use express.static("#{__dirname}/public")

app.get '/', (req, res) ->
    res.render 'index.ejs', levelNumber: 1

app.get /^\/([0-9]+)$/, (req, res) ->
    res.render 'index.ejs', levelNumber: req.params[0]

app.listen port, =>
  console.log "Listen on #{port}"