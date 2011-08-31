{Tower} = require('./tower')
{Level} = require('./level')
{_} = require('underscore')
class Profile
  constructor: (@emitter = null) ->
    @towerPath = "beginner"
    @warriorName = null
    @score = 0
    @abilities = []
    @levelNumber = 4
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
    console.log("newAbilities", newAbilities)
    for ability in newAbilities
      @abilities.push(ability) if ability
    _.uniq(@abilities)

  encode: ->
    JSON.stringify(this)
        
root = exports ? window
root.Profile = Profile