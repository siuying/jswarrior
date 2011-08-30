{Base} = require('./base')

class Feel extends Base
  description: ->
    "Returns a Space for the given direction (forward by default)."

  perform: (direction='forward') ->
    @verifyDirection(direction)
    @space(direction)
  
root = exports ? window
root.Feel = Feel
