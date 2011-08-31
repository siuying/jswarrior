class View
  constructor: (@emitter)->
    
  listen: -> 
    @emitter.on 'game.start', ->
      console.log("Welcome to Ruby Warrior")

    @emitter.on 'game.level.start', (level) ->
      console.log("Starting Level #{level.number}")

    @emitter.on 'level.floor', (character) ->
      console.log(character)
      
    @emitter.on 'level.turn', (turn) ->
      console.log("turn #{turn}")
  
  close: ->
    listeners = [
      'game.start'
      'game.level.start'
      'level.floor'
    ]
    @emitter.removeAllListeners l for l in listeners

root = exports ? window
root.View = View