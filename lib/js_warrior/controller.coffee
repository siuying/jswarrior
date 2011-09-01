{Profile}       = require "./profile"
{Game}          = require "./game"
{Views}          = require "./views"
{EventEmitter}  = require "events"

class Controller
  constructor: (@$, @editor, @coffee, @modernizr=nil) ->
    @emitter = new EventEmitter()
    
    @emitter.on "game.level.failed", =>
      @onLevelFailed()
    
    @emitter.on "game.level.complete", =>
      @onLevelCompleted()

    if @modernizr.history
      @emitter.on "game.level.loaded", (lvl) =>
        @onLevelLoaded(lvl)

  setup: ->
    @setupViews() 
    @setupModels() 
    
  setupModels: ->
    # Setup Model  
    @profile = new Profile(@emitter)

    # Setup Game
    @game = new Game(@emitter, @profile)

  setupViews: ->
    # Setup Views
    @view = new Views.HtmlView(@emitter, $)
    @view.listen()

    # setup click listener for run
    @$("#run").click =>
      source = @editor.getSession().getValue()
      if @coffee
        compiled = @coffee.compile(source, {bare: on})
      else
        compiled = source

      @game.load()
      @game.start(compiled)
      @$("#run").hide()
      @$("#stop").show()
    
    @$("#stop").click =>
      @game.stop()
      @$("#run").show()
      @$("#stop").hide()

    @$("#hint").click =>
      @$("#more_hint_message").toggle()

    # show editor when finished
    @$("#editor").show()
    @$("#hint").show()
    @$("#run").show()
  
  setGameLevel: (level) ->
    @profile.levelNumber = level
    @game.load()    

  onLevelFailed: ->
    @$("#run").show()
    @$("#stop").hide()
    @$("#hint").show()

  onLevelCompleted: ->
    @$("#run").show()
    @$("#stop").hide()
    @$("#hint").show()

  onLevelLoaded: (level) ->
    window.history.pushState {level: level.number}, "Level #{level.number}", "#{level.number}" if level
    
root = exports ? window
root.Controller = Controller