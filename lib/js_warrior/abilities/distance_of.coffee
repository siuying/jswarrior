{Sense} = require('./sense')

class DistanceOf extends Sense
  description: ->
    "Pass a Space as an argument, and it will return an integer representing the distance to that space."

  perform: (space) ->
    @unit.position.distanceOf(space)

root = exports ? window
root.DistanceOf = DistanceOf
