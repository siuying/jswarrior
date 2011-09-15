{Sense} = require('./sense')
{_} = require('underscore')

class DirectionOf extends Sense
  description: ->
    "Pass a Space as an argument, and the direction ('left', 'right', 'forward', 'backward') to that space will be returned."

  perform: (space) ->
    @unit.position.relativeDirectionOf(space)

root = exports ? window
root.DirectionOf = DirectionOf
