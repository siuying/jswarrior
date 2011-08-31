{Sense} = require('./sense')

class Health extends Sense
  description: ->
    "Returns an integer representing your health."

  perform: (direction='forward') ->
    @unit.health

root = exports ? window
root.Health = Health
