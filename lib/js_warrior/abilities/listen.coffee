{Sense} = require('./sense')
{_} = require('underscore')

class Listen extends Sense
  description: ->
    "Returns an array of all spaces which have units in them."

  perform: ->
    units = (unit for unit in @unit.position.floor.units() when unit != @unit)
    _.compact(units)

root = exports ? window
root.Listen = Listen
