{BaseUnit} = require('./base_unit')
{Position} = require('../position')

class Sludge extends BaseUnit
  constructor: (@health, @position) ->
    super
    @addAbilities('attack', 'feel')

  playTurn: (turn) ->
    for direction in Position.RELATIVE_DIRECTIONS
      if turn.feel(direction).isPlayer()
        turn.attack(direction)
        return

  attackPower: ->
    3

  maxHealth: ->
    12

  character: ->
    "s"
    
root = exports ? window
root.Sludge = Sludge
