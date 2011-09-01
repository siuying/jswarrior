{Profile}       = require "./profile"
{Game}          = require "./game"
{Views}          = require "./views"
{EventEmitter}  = require "events"

class Controller
  constructor: (@$, @editor, @coffee) ->
    @emitter = new EventEmitter()
    
    @emitter.on "game.level.failed", =>
      @onGameFailed()
    
    @emitter.on "game.level.complete", =>
      @onGameCompleted()

  setup: ->
    @setupViews() 
    @setupModels() 
    
  setupModels: ->
    # Setup Model  
    @profile = new Profile(@emitter)
    @profile.levelNumber = 1

    # Setup Game
    @game = new Game(@emitter, @profile)
    @game.load()

  setupViews: ->
    # Setup Views
    @view = new Views.HtmlView(@emitter, $)
    @view.listen()

    # setup click listener for run
    @$("#run").click =>
      console.log("run game")
      source = @editor.getSession().getValue()
      compiled = @coffee.compile source, bare: on 
      console.log("source", source)
      @game.start(compiled)
      @$("#run").hide()
      @$("#stop").show()
    
    @$("#stop").click =>
      @game.stop()
      @$("#run").show()
      @$("#stop").hide()
    
    @$("#hint").click =>
      @$("#hint_message").toggle()

    # show editor when finished
    @$("#editor").show()
    @$("#hint").show()
    @$("#run").show()

  onGameFailed: ->
    @$("#run").show()
    @$("#stop").hide()
    @$("#hint").show()

  onGameCompleted: ->
    @$("#run").show()
    @$("#stop").hide()
    @$("#hint").show()
    @game.requestNextLevel()

root = exports ? window
root.Controller = Controller