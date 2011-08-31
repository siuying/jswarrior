{_} = require('underscore')

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
    _.isEqual(@floor.stairs_location, @location())    

  isTicking: ->
    @unit() != null && @unit().getAbilities()['explode'] != null

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

  toString: ->
    if @unit()
      @unit().toString()
    else if @isWall()
      "wall"
    else 
      "nothing"
      

root = exports ? window
root.Space = Space