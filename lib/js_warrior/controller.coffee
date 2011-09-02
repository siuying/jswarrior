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

      @game.load() if @started
      @game.start(compiled)
      @$("#run").hide()
      @$("#stop").show()
      @started = true
    
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
  
  setGameLevel: (level = 1, epic = false) ->
    if epic
      @profile.epic = true
      @profile.levelNumber = 1
      @profile.addAbilities('walk', 'feel', 'attack', 'health', 'rest', 'rescue', 'pivot', 'look', 'shoot')
    else
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
    @started = false
    
  onLevelLoaded: (level) ->
    if !level.profile.isEpic()
      window.history.pushState {level: level.number}, "Level #{level.number}", "#{level.number}" if level

root = exports ? window
root.Controller = Controller