{Profile}       = require "./profile"
{Game}          = require "./game"
{Views}          = require "./views"
{EventEmitter}  = require "events"

class Controller
  constructor: (@$, @editor, @coffee) ->
    @emitter = new EventEmitter()

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
      source = @editor.getSession().getValue()
      compiled = @coffee.compile source, bare: on 
      @game.start(compiled)
      @$("#run").hide()
      @$("#stop").show()
    
    @$("#stop").click =>
      @game.stop()
      @$("#run").show()
      @$("#stop").hide()

    # show editor when finished
    @$("#editor").show()


root = exports ? window
root.Controller = Controller