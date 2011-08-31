class View
  constructor: (@emitter)->
    
  listen: -> 
    @emitter.on 'game.start', =>
      @puts "Welcome to Ruby Warrior"

    @emitter.on 'game.level.start', (level) =>
      @puts "Starting Level #{level.number}"

    @emitter.on 'level.floor', (character) =>
      @puts character
      
    @emitter.on 'level.turn', (turn) =>
      @puts "turn #{turn}"
  
  close: ->
    listeners = [
      'game.start'
      'game.level.start'
      'level.floor'
      'level.turn'
    ]
    @emitter.removeAllListeners l for l in listeners
    
  puts: (text) -> 
    # do nothing

root = exports ? window
root.View = View