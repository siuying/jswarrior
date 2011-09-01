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

  completed: ->
    # Update Score
    score = 0
    
    @emitter?.emit 'game.score.message', "Level Score: #{@warrior.score}"
    score += @warrior.score
    
    @emitter?.emit "Time Bonus: #{@timeBonus}"
    score += @timeBonus
    
    if @floor.otherUnits().length == 0
      score += @clearBonus()
    
    scoreCalculation = @scoreCalculation(@profile.score, score)
    @profile.score += score

    # Update Abilities
    @profile.addAbilities(_.keys(@warrior.abilities)...)
    @emitter.emit "game.level.complete", this
    @emitter.emit "game.level.report", levelScore: @warrior.score, timeBonus: @timeBonus, clearBonus: @clearBonus(), scoreCalculation: scoreCalculation

    console.log("encoded profile", @profile.encode())

  # Play one step in the game world
  play: ->
    return if @isPassed() || @isFailed()

    @currentTurn += 1
    @emitter?.emit 'game.level.changed', this
    
    unit.prepareTurn() for unit in @floor.units()
    unit.performTurn() for unit in @floor.units()

    @time_bonus = @time_bonus - 1 if @time_bonus > 0
  
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

root = exports ? window
root.Level = Level