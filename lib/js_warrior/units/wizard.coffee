{Archer} = require('./archer')

class Wizard extends Archer
  shootPower: ->
    11
  
  maxHealth: ->
    3
  
  character: ->
    "w"

root = exports ? window
root.Wizard = Wizard
