class Position
  DIRECTIONS = ['north', 'east', 'south', 'west']
  RELATIVE_DIRECTIONS = ['forward', 'right', 'backward', 'left']

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

  relativeSpace: (forward, right=0) ->
    @floor.space(@translateOffset(forward, right))

  space: ->
    @floor.space(@x, @y)
    
  move: (forward, right=0) ->
    [@x, @y] = @translateOffset(forward, right)
  
  distanceFromStairs: ->
    distanceOf(@floor.stairsSpaces)
    
  distanceOf: (space) ->
    [x, y] = space.location()
    Math.abs(@x - x) + Math.abs(@y - y)
    
  relativeDirectionOfStairs: ->
    @relativeDirectionOf(@floor.stairsSpace)
  
  relativeDirectionOf: (space) ->
    @relativeDirection(@directionOf(space))
  
  directionOf: (space) ->
    [space_x, space_y] = space.location
    if Math.abs(@x - space_x) > Math.abs(@y - space_y)
      space_x > @x ? 'east' : 'west'
    else
      space_y > @y ? 'south' : 'north'
  
  relativeDirection: (direction) ->
    offset = DIRECTIONS.indexOf(direction) - @direction_index
    offset -= 4 if offset > 3
    offset += 4 if offset < 0    
    RELATIVE_DIRECTIONS[offset]
  
  translateOffset: (forward, right) ->
    switch @direction()
      when 'north'
        [@x + right, @y - forward]
      when 'east'
        [@x + forward, @y + right]
      when 'south'
        [@x - right , @y + forward]
      when 'west'
        [@x - forward, @y - right]
  

root = exports ? window
root.Position = Position