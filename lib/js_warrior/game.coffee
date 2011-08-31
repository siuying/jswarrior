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
    haveFurtherStep = true
    @getCurrentLevel().loadLevel()
    @getCurrentLevel().loadPlayer()

    @emitter.emit 'game.level.start', @currentLevel
    @playGame()
  
  playGame: (step=1) ->
    @currentLevel.play(step)
    
    if @currentLevel.isPassed()
      if @getNextLevel().isExists()
        @emitter.emit "game.level.complete", @currentLevel
      else
        @emitter.emit "game.end"
        haveFurtherStep = false

      if @profile.isEpic()
        @emitter.emit("game.report", this) if !@continue
      else
        @requestNextLevel()
    else
      haveFurtherStep = false
      @emitter.emit "game.level.failed", @getCurrentLevel()
    
    setTimeout (=> @playGame()), 600
      
  getCurrentLevel: ->
    @currentLevel ||= @profile.currentLevel()

  getNextLevel: ->
    @nextLevel ||= @profile.nextLevel()
    

root = exports ? window
root.Game = Game