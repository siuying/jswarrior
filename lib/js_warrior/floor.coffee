Space = require('./space').Space
Position = require('./position').Position

class Floor
  constructor: ->
    @width = 0
    @height = 0
    @__units = []
    @stairs_location = [-1, -1]

  add: (unit, x, y, direction = null) ->
    @__units.push(unit)
    unit.position = new Position(this, x, y, direction)
    
  placeStairs: (x, y) ->
    @stairs_location = [x, y]
    
  stairsSpace: ->
    @space(@stairs_location...)
    
  units: ->
    units = []
    for unit in @__units when unit.position
      units.push(unit)
    units
  
  otherUnits: ->
    units = []
    for unit in @__units when unit.constructor.name != 'Warrior'
      units.push unit
    units

  get: (x, y) ->
    for unit in @__units
      return unit if unit.position.at(x, y)
    null
    
  space: (x, y) ->
    new Space(this, x, y)
  
  isOutOfBounds: (x, y) ->
    x < 0 || y < 0 || x > @width - 1 || y > @height - 1
    
  character: ->
    rows = []
    
  uniqueUnits: ->
    unique_units = []
    for unit in @__units
      unique_unit_names = (unit.constructor.name for unit in unique_units)
      if unique_unit_names.indexOf(unit.constructor.name) == -1
        unique_units.push(unit)
    unique_units

root = exports ? window
root.Floor = Floor