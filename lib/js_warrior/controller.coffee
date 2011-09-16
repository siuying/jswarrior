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
      @profile.sourceCode = source

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
    
    @$("#begin").click =>
      name = @$("#name").val()
      tower = @$("#tower_button").val()
      console.log("begin #{name} #{tower}")
      @profile.warriorName = name
      @setGameLevel(tower, 1, false)
      return false

    # show editor when finished
    @$("#welcome").show()
        
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

    # enable UI
    @$("#control").show()
    @$("#display").show()
    @$("#header").show()
    @$("#welcome").hide()
    @$("#editor").show()
    @$("#hint").show()
    @$("#run").show()
    @editor.setTheme("ace/theme/cobalt")
  
  setProfile: (encodedProfile) ->
    @profile.decode(encodedProfile)
    @editor.getSession().setValue(@profile.sourceCode) if @profile.sourceCode
    @game.load()
    
    # enable UI
    @$("#control").show()
    @$("#display").show()
    @$("#header").show()
    @$("#welcome").hide()
    @$("#editor").show()
    @$("#hint").show()
    @$("#run").show()
    @editor.setTheme("ace/theme/cobalt")

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

  isEpic: ->
    @profile.isEpic()

root = exports ? window
root.Controller = Controller