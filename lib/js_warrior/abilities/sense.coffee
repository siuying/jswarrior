{BaseAbilities} = require('./base_abilities')

class Sense extends BaseAbilities
  constructor: (@unit) ->

  isSense: ->
    true
  
root = exports ? window
root.Sense = Sense
