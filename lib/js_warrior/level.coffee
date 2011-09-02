{_} = require('underscore')
{EventEmitter} = require 'events'
{Utils} = require('./utils')
{LevelLoader} = require('./level_loader')
{Players} = require('./players')

class Level
  constructor: (@profile, @number, @emitter = null) ->
    @timeBonus = 0
    @description = ""
    @tip = ""
    @clue = ""
    @warrior = null
    @floor = null
    @player = null
    @aceScore = 0
    @currentTurn = 0

  loadPath: ->
    if typeof __dirname != "undefined"
      # local run
      project_root = __dirname + "/../../towers/"
    else
      # browser run
      project_root = ""

    level_path =  @profile.towerPath + "/level_" + Utils.lpad(@number.toString(), '0', 3)
    project_root + level_path

  loadLevel: ->
    loader = new LevelLoader(this)    
    level = require(@loadPath()).level
    level.apply(loader)
    @currentTurn = 0
    @emitter?.emit 'game.level.loaded', this
    this

  loadPlayer: (jsString=null) ->
    Player = Players.LazyPlayer

    try
      Player = eval(jsString) if jsString
      @player = new Player()
      @warrior.player = @player

    catch e
      @emitter?.emit "game.play.error", e
      undefined

  # Play one step in the game world
  play: ->
    return if @isPassed() || @isFailed()

    @currentTurn += 1
    @emitter?.emit 'game.level.changed', this
    
    unit.prepareTurn() for unit in @floor.units()
    unit.performTurn() for unit in @floor.units()

    @timeBonus = @timeBonus - 1 if @timeBonus > 0

  completed: ->
    # Update Score
    score = 0

    console.log('level score', @warrior.score)
    score += @warrior.score

    console.log('time bonus', @timeBonus)
    score += @timeBonus

    if @floor.otherUnits().length == 0
      console.log('clear bonus', @clearBonus())
      score += @clearBonus()
    else
      console.log('other units', @floor.otherUnits())

    if @profile.isEpic()
      scoreCalculation = @scoreCalculation(@profile.currentEpicScore, score)
      rate = @profile.currentEpicGrades[@number] = (score / @aceScore) if @aceScore
      console.log("lvl #{@number}: (score / @aceScore) == (#{score} / #{@aceScore})")
      @profile.currentEpicScore += score
    else
      scoreCalculation = @scoreCalculation(@profile.score, score)
      rate = (score / @aceScore) if @aceScore
      @profile.score += score
      @profile.addAbilities(_.keys(@warrior.abilities)...)

    @emitter.emit "game.level.complete", this
    @emitter.emit "game.level.report", grade: Level.gradeLetter(rate), levelScore: @warrior.score, timeBonus: @timeBonus, clearBonus: @clearBonus(), scoreCalculation: scoreCalculation

  isPassed: ->
    !!@floor?.stairsSpace()?.isWarrior()
  
  isFailed: ->
    @floor?.units().indexOf(@warrior) == -1

  scoreCalculation: (currentScore, addScore)-> 
    if currentScore == 0
      "#{addScore}"
    else
      "#{currentScore} + #{addScore} = #{currentScore + addScore}"
  
  isExists: ->
    try
      level = require(@loadPath()).level
      return true
    catch e
      return false
  
  clearBonus: ->
    Math.round((@warrior.score + @timeBonus)*0.2)

  setupWarrior: (warrior) ->
    @warrior = warrior
    @warrior.addAbilities(@profile.abilities...)
    @warrior.setName(@profile.warriorName)
    @warrior.player = @player
    @warrior

  @gradeLetter: (percent) ->
    if percent >= 1.0
      return "S"
    else if percent >= 0.9
      return "A"
    else if percent >=0.8
      return "B"
    else if percent >=0.7
      return "C"
    else if percent >= 0.6
      return "D"
    else
      return "F"
    
    
root = exports ? window
root.Level = Level