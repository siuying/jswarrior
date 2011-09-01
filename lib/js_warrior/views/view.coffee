class View
  constructor: (@emitter)->
    @puts "Welcome to JS Warrior"

  listen: -> 
    @emitter.on 'game.start', =>
      @puts "Game started!"

    @emitter.on 'game.stop', =>
      @puts "You quit the Tower! Try again when you are ready."

    @emitter.on 'game.end', =>
      @puts "CONGRATULATIONS! You have climbed to the top of the tower and rescued the fair maiden Coffee."

    @emitter.on 'game.level.start', (level) =>
      @levelStarted(level)
      
    @emitter.on "game.level.complete", (level) =>
      @levelCompleted(level)
    
    @emitter.on 'game.level.loaded', (level) =>
      @levelLoaded(level)
  
    @emitter.on 'game.level.changed', (level) =>
      @levelChanged(level)

    @emitter.on "game.level.failed", (level) =>
      @puts "You failed! Improve your warrior and try again!"
      
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
  
  levelLoaded: (level) ->
    @levelChanged(level)

  levelStarted: (level) ->
    @puts "Starting Level #{level.number}"

  levelCompleted: (level) ->
    @puts "Success! You have found the stairs."

  clear: ->
    # clear screen
    
  onError: (e) ->
    console.trace(e)
    @puts "Error: #{e}"

root = exports ? window
root.View = View