class Space
  constructor: (@floor, @x, @y) ->
    
  isWall: ->
    @floor.isOutOfBounds @x, @y
  
  isWarrior: ->
    @unit()?.constructor?.name == "Warrior"

  isGolem: ->
    @unit()?.constructor?.name == "Golem"

  isPlayer: ->
    @isWarrior() || @isGolem()
    
  isEnemy: ->
    @unit() != null && !@isPlayer() && !@isCaptive()
  
  isCaptive: ->
    @unit() != null && @unit().isBound()
    
  isEmpty: ->
    !@unit() && !@isWall()

  isStairs: ->
    @floor.stairs_location == @location

  isTicking: ->
    @unit() != null && @unit().abilities.indexOf('explode') > -1

  unit: ->
    @floor.get(@x, @y) || null
  
  location: ->
    [@x, @y]
  
  character: ->
    if @unit()
      @unit().character
    else if @isStairs()
      ">"
    else 

  to_s: ->
    if @unit()
      @unit().to_s()
    else if @isWall()
      "wall"
    else 
      "nothing"
      

root = exports ? window
root.Space = Space