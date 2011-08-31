{Action} = require('./action')

class Rest extends Action
  description: ->
    "Gain 10% of max health back, but do nothing more."

  perform: (direction='forward') ->
    if @unit.health < @unit.maxHealth()
      amount = Math.round(@unit.maxHealth()*0.1)
      amount = @unit.maxHealth() - @unit.health if (@unit.health + amount) > @unit.maxHealth()
      @unit.health += amount
      @unit.say "receives #{amount} health from resting, up to #{@unit.health} health"
    else
      @unit.say "is already fit as a fiddle"
  
root = exports ? window
root.Rest = Rest
