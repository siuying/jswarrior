_ = require('underscore')

class Profile
  constructor: ->
    @towerPath = null
    @warriorName = null
    @score = 0
    @abilities = []
    @levelNumber = 0
    @lastLevelNumber = undefined

  to_s: ->
    [@warriorName, "level #{@levelNumber}", "score #{@score}"].join('-')
  
  tower: ->
    new Tower(@towerPath)
  
  currentLevel: ->
    new Level(this, @levelNumber)
    
  nextLevel: ->
    new Level(this, @levelNumber + 1)
  
  addAbilities: (newAbilities...) ->
    for ability in newAbilities
      @abilities.push(ability)
    @ability = _.uniq(@abilities)

root = exports ? window
root.Profile = Profile