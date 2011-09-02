{Profile} = require './profile'
{Level}   = require './level'
{_}       = require 'underscore'

class Game
  NORMAL_TIME = 600
  EPIC_TIME = 100
  
  constructor: (@emitter, @profile = null)->
    @profile ?= new Profile(@emitter)
    @currentLevel = null
    @running = false

  load: (playerSource=null) ->
    @getCurrentLevel().loadLevel()

  start: (playerSource=null) -> 
    if @getCurrentLevel().loadPlayer(playerSource)
      @stop()
      @emitter.emit 'game.start'
      @playNormalMode()

  # stop a running game
  stop: ->
    clearInterval(@intervalId) if @intervalId
    @running = false

  playNormalMode: ->
    @playCurrentLevel()
      
  playCurrentLevel: ->
    @emitter.emit 'game.level.start', @currentLevel
    if @profile.epic
      @intervalId = setInterval (=> @playGame()), EPIC_TIME 
    else
      @intervalId = setInterval (=> @playGame()), NORMAL_TIME
    
  playGame: (step=1) ->
    @running = true
    haveFurtherStep = true
    
    try
      @currentLevel.play(step)
    catch e
      @emitter.emit "game.play.error", e
      @stop()
    
    if @currentLevel.isPassed()
      @stop() unless @profile.isEpic()
      @currentLevel.completed()
      @requestNextLevel()

    else if @currentLevel.isFailed()
      @stop()
      @emitter.emit "game.level.failed", @getCurrentLevel()

  prepareEpicMode: ->
    @profile.score = 0
    @profile.epic = true
    @profile.levelNumber = 1
    @profile.currentEpicScore = 0
    @profile.currentEpicGrades = {}
    @currentLevel = @profile.currentLevel()
    @nextLevel = @profile.nextLevel()
    @getCurrentLevel().loadLevel()
  
  finalReport: ->
    if @profile.calculateAverageGrade      
      levels = ("  Level #{level}: #{Level.gradeLetter(@profile.currentEpicGrades[level])}" for level in _.keys(@profile.currentEpicGrades))
      report = "Your average grade for this tower is: #{Level.gradeLetter(@profile.calculateAverageGrade())}<br/>
      #{levels.join('<br/>\n')}<br/>"
      console.log(levels.join('\n'))
      report

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
        @stop()
        
        @emitter.emit "game.epic.end", this
      else
        # Enter Epic Mode!
        @emitter.emit 'game.epic.start', this
        @prepareEpicMode()

  getCurrentLevel: ->
    @currentLevel ||= @profile.currentLevel()

  getNextLevel: ->
    @nextLevel ||= @profile.nextLevel()
    
  isRunning: ->
    @running
    

root = exports ? window
root.Game = Game