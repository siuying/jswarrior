class Base
  constructor: (@unit) ->
  
  offset: (direction, forward=1, right=0) ->
    switch direction
      when 'forward'
        return [forward, -right]
      when 'backward'
        return [-forward, right]
      when 'right'
        return [right, forward]
      when 'left'
        return [-right, -forward]
  
  space: (direction, forward=1, right=0) ->
    @unit.position.relativeSpace(offset(direction, forward, right)...)
  
  
root = exports ? window
root.Base = Base
