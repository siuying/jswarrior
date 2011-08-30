{Action} = require('./action')

class Attack extends Action
  description: ->
    "Attacks a unit in given direction (forward by default)."

  perform: (direction='forward') ->
    @verifyDirection(direction)
    receiver = @unit(direction)
    if receiver
      @unit.say "attacks #{direction} and hits #{receiver}"
      if direction == 'backward'
        power = Math.ceil(@unit.attackPower/2.0)
      else
        power = @unit.attackPower
  
root = exports ? window
root.Attack = Attack
