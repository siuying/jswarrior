{Floor} = require('./floor')
{Units} = require('./units')
{Utils} = require('./utils')

class LevelLoader
  constructor: (level) ->
    @floor = new Floor()
    @level = level
    @level.floor = @floor if level

  setDescription: (desc) ->
    @level.description = desc
  
  setTip: (tip) ->
    @level.tip = tip
    
  setClue: (clue) ->
    @level.clue = clue
    
  setTimeBonus: (bonus) ->
    @level.timeBonus = bonus
    
  aceScore: (score) ->
    @level.score = score
  
  setSize: (width, height) ->
    @floor.width = width
    @floor.height = height
  
  setStairs: (x, y) ->
    @floor.placeStairs(x, y)
  
  setUnit: (unit, x, y, facing = 'north', callback = null) ->
    camelName = "new Units.#{Utils.toCamelCase(unit)}()"
    unit = eval(camelName)

    @floor.add(unit, x, y, facing)
    if callback != null
      callback.apply(unit)

    unit
  
  setWarrior: (x, y, facing = 'north', callback) ->
    @level.setupWarrior(@setUnit('warrior', x, y, facing, callback))

root = exports ? window
root.LevelLoader = LevelLoader