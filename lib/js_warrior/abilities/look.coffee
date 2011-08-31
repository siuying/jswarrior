{Sense} = require('./sense')
{_} = require('underscore')

class Look extends Sense
  description: ->
    "Returns an array of up to three Spaces in the given direction (forward by default)."

  perform: (direction='forward') ->
    @verifyDirection(direction)
    _.map([1..3], (amount) => @space(direction, amount) )
  
root = exports ? window
root.Look = Look
