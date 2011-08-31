{BaseAbilities} = require('./base_abilities')

class Action extends BaseAbilities
  constructor: (@unit) ->

  isAction: ->
    true

root = exports ? window
root.Action = Action
