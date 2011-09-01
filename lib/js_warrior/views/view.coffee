class View
  constructor: (@emitter)->
    
  listen: -> 
    @emitter.on 'game.start', =>
      @puts "Welcome to JavaScript Warrior"

    @emitter.on 'game.stop', =>
      @puts "You quit the Tower! Try again when you are ready."

    @emitter.on 'game.end', =>
      @puts "CONGRATULATIONS! You have climbed to the top of the tower and rescued the fair maiden Coffee."

    @emitter.on 'game.level.start', (level) =>
      @levelStarted(level)
      
    @emitter.on "game.level.complete", (level, nextLevel) =>
      @levelCompleted(level, nextLevel)

    @emitter.on 'game.level.changed', (level) =>
      @levelChanged(level)

    @emitter.on 'unit.say', (name, params) =>
      @puts "#{name} #{params}"
      
    @emitter.on "game.play.error", (e) =>
      @onError(e)

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
  
  levelStarted: (level) ->
    @puts "Starting Level #{level.number}"

  levelCompleted: (level, nextLevel) ->
    @puts "Success! You have found the stairs."
  
  onError: (e) ->
    console.trace(e)
    @puts "Error in Player: #{e.message}"

root = exports ? window
root.View = View