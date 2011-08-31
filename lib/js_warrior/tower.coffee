{Utils} = require('./utils')

class Tower
  constructor: (@path) ->
    
  name: ->
    Utils.basename @path
  
  to_s: ->
    @name()

root = exports ? window
root.Tower = Tower