class Level
  constructor: (@profile, @number) ->
    @time_bouns = 0
    @description = ""
    @tip = ""
    @clue = ""
    @warrior = null
    @floor = null
    @ace_score = 0
  
  load_level: ->
    # load level
  
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