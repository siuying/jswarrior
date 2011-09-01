class View
  constructor: (@emitter)->
    
  listen: -> 
    @emitter.on 'game.start', =>
      @puts "Welcome to JavaScript Warrior"

    @emitter.on 'game.end', =>
      @puts "Completed all stage! Try again for more points!"

    @emitter.on 'game.level.start', (level) =>
      @puts "Starting Level #{level.number}"

    @emitter.on 'level.changed', (level) =>
      @levelChanged(level)

    @emitter.on 'unit.say', (name, params) =>
      @puts "#{name} #{params}"
    

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
    
  levelChanged: (level) ->
    # do nothing

root = exports ? window
root.View = View