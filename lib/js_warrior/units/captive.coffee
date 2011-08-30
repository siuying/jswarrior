{Base} = require('./base')

class Captive extends Base
  constructor: ->
    @bind()

  maxHealth: ->
    1
  
  character: ->
    "C"

root = exports ? window
root.Captive = Captive