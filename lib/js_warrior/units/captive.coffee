{BaseUnit} = require('./base_unit')

class Captive extends BaseUnit
  constructor: (@health, @position) ->
    super
    @bind()

  maxHealth: ->
    1
  
  character: ->
    "C"

root = exports ? window
root.Captive = Captive