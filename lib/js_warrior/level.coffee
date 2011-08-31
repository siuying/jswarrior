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
      playTurn: (turn) ->

    Player = eval(jsString) if jsString

    @player = new Player()

  play: (turns = 1000) ->
    for turn in [1..turns]
      return if @isPassed() || @isFailed()

      @currentTurn += 1
      @emitter?.emit 'level.turn', @currentTurn
      @emitter?.emit 'level.floor', @floor.character()
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
    @warrior.name = @profile.warrior_name
    @warrior.player = @player
    @warrior

root = exports ? window
root.Level = Level