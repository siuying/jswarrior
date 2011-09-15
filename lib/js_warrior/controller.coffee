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

    # in epic mode, display run button and show restart button
    @emitter.on "game.epic.start", =>
      window.history.pushState {}, "Epic", "/epic"

    @emitter.on "game.play.error", =>
      @onLevelFailed()

    @emitter.on "game.epic.end", =>
      @onGameCompleted()

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

      if @isEpic()
        @profile.levelNumber = 1
        @profile.currentEpicScore = 0
        @profile.currentEpicGrades = {}
        @view.clear()
        @game = new Game(@emitter, @profile)
        @game.load()
      else if @started
        @game.load()
        
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
  
  setGameLevel: (towerPath = 'beginner', level = 1, epic = false) ->
    if epic
      @profile.epic = true
      @profile.levelNumber = 1
      @profile.currentEpicScore = 0
      @profile.currentEpicGrades = {}
      
      if (towerPath == 'beginner')
        @profile.addAbilities('walk', 'feel', 'attack', 'health', 'rest', 'rescue', 'pivot', 'look', 'shoot')
      else
        @profile.addAbilities('walk', 'feel', 'directionOfStairs', 'attack', 'health', 'rest', 'rescue', 'bind', 'listen', 'directionOf', 'look', 'detonate', 'distanceOf')
    else
      @profile.levelNumber = level
    @profile.towerPath = towerPath
    @game.load()

  onLevelFailed: ->
    @$("#run").show()
    @$("#stop").hide()
    @$("#hint").show()

  onLevelCompleted: ->
    if not @isEpic()
      @$("#run").show()
      @$("#stop").hide()
      @$("#hint").show()
      @started = false
      
  onGameCompleted: ->
    @$("#run").show()
    @$("#stop").hide()
    @$("#hint").show()
    @started = false

  onLevelLoaded: (level) ->
    if not @isEpic()
      window.history.pushState {level: level.number}, "Level #{level.number}", "#{level.number}" if level
      
  isEpic: ->
    @profile.isEpic()

root = exports ? window
root.Controller = Controller