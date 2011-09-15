{Action} = require('./action')

class Detonate extends Action
  description: ->
    "Detonate a bomb in a given direction (forward by default) which damages that space and surrounding 4 spaces (including yourself)."

  perform: (direction='forward') ->
    @verifyDirection(direction)

    if @unit.position
      @unit.say "detonates a bom #{direction} launching a deadly explosion."
      @bomb(direction, 1, 0, 8)
      for space in [[1, 1], [1, -1], [2, 0], [0, 0]]
        [x, y] = space
        @bomb(direction, x, y, 4)
  
  bomb: (direction, x, y, damage_amount) ->
    if @unit.position
      receiver = @space(direction, x, y).getUnit()
      if receiver
        if receiver.abilities['explode']
          receiver.say "caught in bomb's flames which detonates ticking explosive"
          receiver.abilities['explode'].perform()
        else
          @damage(receiver, damage_amount)
        
root = exports ? window
root.Detonate = Detonate
