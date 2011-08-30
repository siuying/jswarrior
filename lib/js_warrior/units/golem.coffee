{Base} = require('./base')

class Golem extends Base
  constructor: ->
    @turn = null
    @maxHealth = 0

  play_turn: (turn) ->
    # TO DO: Implement Me

  attackPower: ->
    3

  character: ->
    "G"

root = exports ? window
root.Golem = Golem
