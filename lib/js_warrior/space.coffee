{_} = require('underscore')

class Space
  constructor: (@floor, @x, @y) ->
    
  isWall: ->
    @floor.isOutOfBounds @x, @y
  
  isWarrior: ->
    (@getUnit()?.constructor.name == "Warrior")

  isGolem: ->
    (@getUnit()?.constructor.name == "Golem")

  isPlayer: ->
    @isWarrior() || @isGolem()
    
  isEnemy: ->
    @getUnit() != null && !@isPlayer() && !@isCaptive()
  
  isCaptive: ->
    @getUnit() != null && @getUnit().isBound()
    
  isEmpty: ->
    !@getUnit() && !@isWall()

  isStairs: ->
    _.isEqual(@floor.stairs_location, @location())    

  isTicking: ->
    @getUnit() != null && @getUnit().getAbilities()['explode'] != null

  getUnit: ->
    @floor.get(@x, @y) || null
  
  location: ->
    [@x, @y]
  
  character: ->
    if @getUnit()
      @getUnit().character()
    else if @isStairs()
      ">"
    else 
      " "

  toString: ->
    if @getUnit()
      @getUnit().toString()
    else if @isWall()
      "wall"
    else 
      "nothing"
      

root = exports ? window
root.Space = Space