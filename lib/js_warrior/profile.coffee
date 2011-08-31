{Tower} = require('./tower')
{Level} = require('./level')

class Profile
  constructor: (@emitter = null) ->
    @towerPath = "beginner"
    @warriorName = null
    @score = 0
    @abilities = []
    @levelNumber = 2
    @epic = false
    @lastLevelNumber = undefined

  toString: ->
    [@warriorName, "level #{@levelNumber}", "score #{@score}"].join('-')
  
  tower: ->
    new Tower(@towerPath)
  
  currentLevel: ->
    new Level(this, @levelNumber, @emitter)
    
  nextLevel: ->
    new Level(this, @levelNumber + 1, @emitter)
  
  isEpic: ->
    @epic
  
  addAbilities: (newAbilities...) ->
    for ability in newAbilities
      @abilities.push(ability)
    @ability = _.uniq(@abilities)

root = exports ? window
root.Profile = Profile