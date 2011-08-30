class Position
  DIRECTIONS = ['north', 'east', 'south', 'west']

  constructor: (@floor, @x, @y, direction = null) ->
    @direction_index = DIRECTIONS.indexOf(direction || 'north')
  
  at: (x, y) ->
    @x == x && @y == y
  
  direction: ->
    DIRECTIONS[@direction_index]
  
  rotate: (amount) ->
    @direction_index += amount
    @direction_index -= 4 if @direction_index > 3
    @direction_index += 4 if @direction_index < 0

  relative_space: (forward, right=0) ->
    #@floor.space()

  space: ->
    @floor.space(@x, @y)

root = exports ? window
root.Position = Position