{BaseUnit} = require('./base_unit')

class Archer extends BaseUnit
  constructor: (@health, @position) ->
    super
    @addAbilities('shoot', 'look')

  playTurn: (turn) ->
    for direction in ['forward', 'left', 'right']
      for space in turn.look(direction)
        if space.isPlayer()
          turn.shoot(direction)
          return
        else if !space.isEmpty()
          break

  shootPower: ->
    3

  maxHealth: ->
    7

  character: ->
    "a"
    
root = exports ? window
root.Archer = Archer
