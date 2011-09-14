{Action} = require('./action')

class Bind extends Action
  description: ->
    "Binds a unit in given direction to keep him from moving (forward by default)."

  perform: (direction='forward') ->
    @verifyDirection(direction)
    receiver = @getUnit(direction)
    if receiver
      @unit.say "binds #{direction} and restricts #{receiver}"
      receiver.bind()

    else
      @unit.say "binds #{direction} and restricts nothing"
  
root = exports ? window
root.Bind = Bind
