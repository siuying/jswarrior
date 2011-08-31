{Action} = require('./action')

class Walk extends Action
  constructor: (@unit) ->

root = exports ? window
root.Walk = Walk
