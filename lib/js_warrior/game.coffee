{Profile} = require './profile'

class Game
  constructor: (@emitter, @profile = null)->
    @profile ?= new Profile(@emitter)
    @currentLevel = null
    @running = false

  load: (playerSource=null) ->
    @getCurrentLevel().loadPlayer(playerSource)
    @getCurrentLevel().loadLevel()

  start: (playerSource=null) -> 
    @load(playerSource)
    @emitter.emit 'game.start'
    @playNormalMode()

  playNormalMode: ->
    @playCurrentLevel()

  playCurrentLevel: ->
    @emitter.emit 'game.level.start', @currentLevel
    @playGame()
  
  playGame: (step=1) ->
    @running = true
    haveFurtherStep = true
    
    try
      @currentLevel.play(step)
    catch e
      @emitter.emit "game.play.error", e
      haveFurtherStep = false
    
    if @currentLevel.isPassed()
      @currentLevel.completed()

      if @getNextLevel().isExists()
        @emitter.emit "game.level.complete", @currentLevel, @nextLevel
      else
        @emitter.emit "game.level.complete", @currentLevel, @nextLevel
        @emitter.emit "game.end"
        haveFurtherStep = false

      if @profile.isEpic()
        @emitter.emit("game.report", this) if !@continue
      else
        @requestNextLevel()
    else if @currentLevel.isFailed()
      haveFurtherStep = false
      @emitter.emit "game.level.failed", @getCurrentLevel()

    @running = haveFurtherStep
    if haveFurtherStep
      setTimeout (=> @playGame()), 600

  requestNextLevel: ->
    if @getNextLevel().isExists()
      @prepareNextLevel()
    else
      # @prepareEpicMode()
    
  getCurrentLevel: ->
    @currentLevel ||= @profile.currentLevel()

  getNextLevel: ->
    @nextLevel ||= @profile.nextLevel()
    
  isRunning: ->
    @running
    

root = exports ? window
root.Game = Game