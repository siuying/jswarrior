{Profile} = require './profile'

class Game
  constructor: (@emitter)->
    @currentLevel = null

  start: -> 
    @emitter.emit 'game.start'
    
    # create profile if needed
    @profile = new Profile(@emitter)

    # start a game
    @playNormalMode()

  playNormalMode: ->
    @playCurrentLevel()

  playCurrentLevel: ->
    @getCurrentLevel().loadPlayer()
    @getCurrentLevel().loadLevel()

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