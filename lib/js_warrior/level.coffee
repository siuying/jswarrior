{EventEmitter} = require 'events'
{Utils} = require('./utils')
{LevelLoader} = require('./level_loader')

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
    this

  loadPlayer: (jsString=null) ->
    Player = class Player
      constructor: ->
      playTurn: (warrior) ->
        warrior.walk()

    Player = eval(jsString) if jsString

    @player = new Player()

  # Play one step in the game world
  play: ->
    return if @isPassed() || @isFailed()

    @currentTurn += 1
    @emitter?.emit 'level.changed', this
    
    unit.prepareTurn() for unit in @floor.units()
    unit.performTurn() for unit in @floor.units()

    @time_bonus = @time_bonus - 1 if @time_bonus > 0
  
  isPassed: ->
    !!@floor?.stairsSpace()?.isWarrior()
  
  isFailed: ->
    @floor?.units().indexOf(@warrior) == -1
    
  isExists: ->
    try
      level = require(@loadPath()).level
      return true
    catch e
      return false

  setupWarrior: (warrior) ->
    @warrior = warrior
    @warrior.addAbilities(@profile.abilities...)
    @warrior.setName(@profile.warriorName)
    @warrior.player = @player
    @warrior

root = exports ? window
root.Level = Level