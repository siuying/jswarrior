{Profile} = require './profile'

class Game
  NORMAL_TIME = 600
  EPIC_TIME = 300
  
  constructor: (@emitter, @profile = null)->
    @profile ?= new Profile(@emitter)
    @currentLevel = null
    @running = false

  load: (playerSource=null) ->
    @getCurrentLevel().loadLevel()

  start: (playerSource=null) -> 
    if @getCurrentLevel().loadPlayer(playerSource)
      @shouldStop = false
      @emitter.emit 'game.start'
      @playNormalMode()

  # stop a running game
  stop: ->
    @shouldStop = true

  playNormalMode: ->
    @playCurrentLevel()

      
  playCurrentLevel: ->
    @emitter.emit 'game.level.start', @currentLevel
    @playGame()
  
  playGame: (step=1) ->
    if @shouldStop
      @running = false
      return

    @running = true
    haveFurtherStep = true
    
    try
      @currentLevel.play(step)
    catch e
      @emitter.emit "game.play.error", e
      haveFurtherStep = false
    
    if @currentLevel.isPassed()
      haveFurtherStep = @profile.isEpic()
      @currentLevel.completed()
      @requestNextLevel()

    else if @currentLevel.isFailed()
      haveFurtherStep = false
      @emitter.emit "game.level.failed", @getCurrentLevel()

    @running = haveFurtherStep
    if haveFurtherStep
      if @profile.isEpic()
        setTimeout (=> @playGame()), EPIC_TIME
      else
        setTimeout (=> @playGame()), NORMAL_TIME

  prepareEpicMode: ->
    @profile.score = 0
    @profile.epic = 1
    @profile.levelNumber = 1
    @currentLevel = @profile.currentLevel()
    @nextLevel = @profile.nextLevel()
    @getCurrentLevel().loadLevel()

  requestNextLevel: ->
    if @getNextLevel().isExists()
      player = @getCurrentLevel().player if @profile.isEpic()
      @currentLevel = @getNextLevel()
      @profile.levelNumber += 1
      @nextLevel = @profile.nextLevel()
      @getCurrentLevel().player = player if @profile.isEpic()
      @getCurrentLevel().loadLevel()

    else
      @emitter.emit "game.end"
      if @profile.isEpic()
        @emitter?.emit 'game.level.changed', @getCurrentLevel()
        @shouldStop = true
        @emitter.emit "game.epic.end"
      else
        # Enter Epic Mode!
        @prepareEpicMode()
        @emitter.emit 'game.epic.start'

  getCurrentLevel: ->
    @currentLevel ||= @profile.currentLevel()

  getNextLevel: ->
    @nextLevel ||= @profile.nextLevel()
    
  isRunning: ->
    @running
    

root = exports ? window
root.Game = Game