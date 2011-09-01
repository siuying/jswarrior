{Profile} = require './profile'

class Game
  constructor: (@emitter, @profile = null)->
    @profile ?= new Profile(@emitter)
    @currentLevel = null

  load: ->
    @getCurrentLevel().loadPlayer()
    @getCurrentLevel().loadLevel()

  start: -> 
    @load()
    @emitter.emit 'game.start'
    @playNormalMode()

  playNormalMode: ->
    @playCurrentLevel()

  playCurrentLevel: ->
    @emitter.emit 'game.level.start', @currentLevel
    @playGame()
  
  playGame: (step=1) ->
    haveFurtherStep = true
    @currentLevel.play(step)
    
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
    

root = exports ? window
root.Game = Game