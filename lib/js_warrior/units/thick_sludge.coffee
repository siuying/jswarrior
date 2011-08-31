{Sludge} = require('./sludge')

class ThickSludge extends Sludge
  character: ->
    "S"
    
root = exports ? window
root.ThickSludge = ThickSludge
