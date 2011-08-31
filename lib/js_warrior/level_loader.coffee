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
    
  timeBonus: (bonus) ->
    @level.timeBonus = bonus
    
  score: (score) ->
    @level.score = score
  
  size: (width, height) ->
    @floor.width = width
    @floor.height = height
  
  stairs: (x, y) ->
    @floor.placeStairs(x, y)
  
  unit: (unit, x, y, facing = 'north', callback = null) ->
    camelName = "new Units.#{Utils.toCamelCase(unit)}()"
    unit = eval(camelName)

    @floor.add(unit, x, y, facing)
    if callback != null
      callback.apply(unit)

    unit
  
  warrior: (x, y, facing = 'north', callback) ->
    @level.setupWarrior(@unit('warrior', x, y, facing, callback))

root = exports ? window
root.LevelLoader = LevelLoader