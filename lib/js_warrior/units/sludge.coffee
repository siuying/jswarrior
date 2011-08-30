{Base} = require('./base')

class Sludge extends Base
  constructor: ->
    @addAbilities('attack', 'feel')

  play_turn: (turn) ->
    @player().play_turn(turn)

  attackPower: ->
    3

  maxHealth: ->
    12

  character: ->
    "s"
    
root = exports ? window
root.Sludge = Sludge
