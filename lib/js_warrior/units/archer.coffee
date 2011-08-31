{BaseUnit} = require('./base_unit')

class Archer extends BaseUnit
  constructor: (@health, @position) ->
    super
    @addAbilities('shoot', 'look')

  playTurn: (turn) ->
    for direction in ['forward', 'left', 'right']
      spaces = turn.look(direction)
      for s in spaces
        if s.isPlayer()
          turn.shoot(direction)
        else if !s.isEmpty()
          # there are somthing else between player and archer
          # do not shoot
          break

  shootPower: ->
    3

  maxHealth: ->
    7

  character: ->
    "a"
    
root = exports ? window
root.Archer = Archer
