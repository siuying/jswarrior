{Position} = require('../position')

class BaseAbilities
  constructor: (@unit) ->
  
  offset: (direction, forward=1, right=0) ->
    switch direction
      when 'forward'
        return [forward, -right]
      when 'backward'
        return [-forward, right]
      when 'right'
        return [right, forward]
      when 'left'
        return [-right, -forward]
  
  space: (direction, forward=1, right=0) ->
    @unit.position.relativeSpace(@offset(direction, forward, right)...)
  
  getUnit: (direction, forward=1, right=0) ->
    @space(direction, forward, right).getUnit()
  
  damage: (receiver, amount) ->
    receiver.takeDamage(amount)
    @unit.earnPoints(receiver.maxHealth()) unless receiver.isAlive()
  
  description: ->
    undefined
  
  passTurn: ->
    undefined
    
  verifyDirection: (direction) ->
    unless Position.RELATIVE_DIRECTIONS.indexOf(direction) != -1
      throw "Unknown direction \'#{direction}\'. Should be forward, backward, left or right."

  isSense: ->
    false
    
  isAction: ->
    false
  
  
root = exports ? window
root.BaseAbilities = BaseAbilities
