{Base} = require('./base')

class Sense extends Base
  constructor: (@unit) ->

  isSense: ->
    true
  
root = exports ? window
root.Sense = Sense
