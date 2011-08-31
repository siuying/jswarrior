{BaseUnit} = require('./base_unit')

class Golem extends BaseUnit
  constructor: (@health, @position) ->
    super
    @turn = null
    @maxHealth = 0

  playTurn: (turn) ->
    # TO DO: Implement Me

  attackPower: ->
    3

  character: ->
    "G"

root = exports ? window
root.Golem = Golem
