{Action} = require('./action')

class Walk extends Action
  constructor: (@unit) ->

  perform: (direction='forward') ->
    @verifyDirection(direction)
    if @unit.position
      @unit.say "walks #{direction}"
      if @space(direction).isEmpty()
        @unit.position.move(@offset(direction)...)
      else
        @unit.say "bumps into #{@space(direction)}"

root = exports ? window
root.Walk = Walk
