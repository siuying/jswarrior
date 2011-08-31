stitch  = require('stitch')
fs      = require('fs')
coffee  = require('coffee-script')

task 'compile', 'rebuild output javascript', (options) ->
  package = stitch.createPackage(
    paths: [
      __dirname + '/vendor'
      __dirname + '/lib'
      __dirname + '/towers'
    ]
  )

  package.compile((err, source) -> 
    fs.writeFile 'output/js_warrior.js', source, (err) ->
      throw err if err
      console.log('Compiled output/js_warrior.js')
  )

task 'test', 'run test', (options) ->
  

task 'play', 'sample run the game', (options) ->
  {JsWarrior} = require('./lib/js_warrior')
  {EventEmitter} = require 'events'

  emitter = new EventEmitter()

  view = new JsWarrior.View(emitter);
  view.listen();

  game = new JsWarrior.Game(emitter);
  game.start();