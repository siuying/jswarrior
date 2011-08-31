{Utils} = require('./utils')

class Tower
  constructor: (@path) ->
    
  name: ->
    Utils.basename @path
  
  toString: ->
    @name()

root = exports ? window
root.Tower = Tower