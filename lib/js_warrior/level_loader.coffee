{Floor} = require('./floor')
{Units} = require('./units')
{Utils} = require('./utils')

class LevelLoader
  constructor: (level) ->
    @floor = new Floor()
    @level = level
    @level.floor = @floor if level

  description: (desc) ->
    @level.description = desc
  
  tip: (tip) ->
    @level.tip = tip
    
  clue: (clue) ->
    @level.clue = clue
    
  time_bonus: (bonus) ->
    @level.timeBonus = bonus
    
  ace_score: (score) ->
    @level.aceScore = score
  
  size: (width, height) ->
    @floor.width = width
    @floor.height = height
  
  stairs: (x, y) ->
    @floor.placeStairs(x, y)
  
  unit: (unit, x, y, facing = 'north', block = null) ->
    try
      camelName = "new Units.#{Utils.toCamelCase(unit)}()"
      unit = eval(camelName)
    catch e
      console.trace(e)
      throw "LevelLoader: failed initialized unit: #{unit}"

    @floor.add(unit, x, y, facing)
    if block
      block.call(unit, unit)
    
    unit.emitter = @level.emitter
    unit
  
  warrior: (x, y, facing = 'north', block) ->
    unit = @level.setupWarrior(@unit('warrior', x, y, facing, block))
    unit.emitter = @level.emitter
    unit

root = exports ? window
root.LevelLoader = LevelLoader