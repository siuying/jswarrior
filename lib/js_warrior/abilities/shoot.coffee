{Action} = require('./action')
{_} = require('underscore')

class Shoot extends Action
  description: ->
    "Shoot your bow & arrow in given direction (forward by default)."

  perform: (direction='forward') ->
    @verifyDirection(direction)
    receiver = _.first(_.compact(@multiUnits(direction, [1..3])))
    if receiver
      @unit.say "shoots #{direction} and hits #{receiver}"
      @damage(receiver, @unit.shootPower())
    else
      @unit.say "shoots and hits nothing"
  
  multiUnits: (direction, range) ->
    _.map(range, (r) => @getUnit(direction, r) )
  
root = exports ? window
root.Shoot = Shoot
