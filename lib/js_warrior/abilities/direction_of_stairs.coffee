{Sense} = require('./sense')
{_} = require('underscore')

class DirectionOfStairs extends Sense
  description: ->
    "Returns the direction ('left', 'right', 'forward', 'backward') the stairs are from your location."

  perform: ->
    @unit.position.relativeDirectionOfStairs()

root = exports ? window
root.DirectionOfStairs = DirectionOfStairs
