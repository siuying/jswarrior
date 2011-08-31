{Utils} = require('./utils')
{LevelLoader} = require('./level_loader')

class Level
  constructor: (@profile, @number) ->
    @timeBonus = 0
    @description = ""
    @tip = ""
    @clue = ""
    @warrior = null
    @floor = null
    @aceScore = 0
    
  loadPath: ->
    project_root = __dirname + "../../"
    level_path =  @profile.towerPath + "/level_" + Utils.lpad(@number.toString(), '0', 3)
    project_root + level_path

  loadLevel: ->
    loader = new LevelLoader(this)
    
    level = require(@loadPath()).level
    level.apply(loader)
    this

  load_player: ->
    # load player
    
  play: (turns = 1000)->
    load_level
    for turn in turns
      return if passed? || failed?
      
      UI.message "- turn #{turn+1} -"    
      @time_bonus = @time_bonus - 1 if @time_bonus > 0
  
  isPassed: ->
    @floor.stairs_space.isWarrior()
  
  isFailed: ->
    @floor.units.indexOf(@warrior) == -1
    
  isExists: ->
    false
  
  setupWarrior: (warrior) ->
    @warrior = warrior
    @warrior.addAbilities(@profile.abilities...)
    @warrior.name = @profile.warrior_name

root = exports ? window
root.Level = Level