{Action}  = require './action'
{_}       = require 'underscore'

class Explode extends Action
  description: ->
    "Kills you and all surrounding units. You probably don't want to do this intentionally."
  
  constructor: ->
    super
    @time = 0

  perform: ->
    if @unit.position
      @unit.say "explodes, collapsing the ceiling and damanging every unit."
      _.map(@unit.position.floor.units(), (unit) -> unit.takeDamage(100)) 

  passTurn: ->
    if @time > 0 && @unit.position
      @unit.say "is ticking"
      @time -= 1
      @perform() if @time == 0  

root = exports ? window
root.Explode = Explode
