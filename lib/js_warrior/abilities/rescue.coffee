{Action} = require('./action')

class Rescue extends Action
  description: ->
    "Rescue a captive from his chains (earning 20 points) in given direction (forward by default)."

  perform: (direction='forward') ->
    @verifyDirection(direction)
    if @space(direction).isCaptive()
      receiver = @getUnit(direction)

      @unit.say "unbinds #{direction} and rescues #{receiver}"
      receiver.unbind()
      
      if receiver.constructor.name == "Captive"
        receiver.position = null
        @unit.earnPoints(20)
      
    else
      @unit.say "unbinds #{direction} and rescues nothing"
  
root = exports ? window
root.Rescue = Rescue
