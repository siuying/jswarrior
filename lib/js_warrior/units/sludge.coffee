{Base} = require('./base')

class Sludge extends Base
  constructor: ->
    @addAbilities('attack', 'feel')

  playTurn: (turn) ->
    @player().playTurn(turn)

  attackPower: ->
    3

  maxHealth: ->
    12

  character: ->
    "s"
    
root = exports ? window
root.Sludge = Sludge
