{Base} = require('./base')

class Action extends Base
  constructor: (@unit) ->

  isAction: ->
    true

root = exports ? window
root.Action = Action
