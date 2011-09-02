{Sludge} = require('./sludge')

class ThickSludge extends Sludge
  character: ->
    "S"

  maxHealth: ->
    24

root = exports ? window
root.ThickSludge = ThickSludge
