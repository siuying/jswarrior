{Action}    = require './action'

class Pivot extends Action
  @ROTATION_DIRECTIONS = ['forward', 'right', 'backward', 'left']
  
  description: ->
    "Rotate 'left', 'right' or 'backward' (default)"
  
  perform: (direction = 'backward') ->
    @verifyDirection(direction)
    @unit.position.rotate(Pivot.ROTATION_DIRECTIONS.indexOf(direction))
    @unit.say "pivots #{direction}"
    
root = exports ? window
root.Pivot = Pivot