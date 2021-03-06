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
      @levelChanged(level)
      
    @emitter.on 'unit.say', (name, params) =>
      @puts "#{name} #{params}"

    @emitter.on "game.score.message", (message) =>
      @puts message

    @emitter.on "game.play.error", (e) =>
      @onError(e)

    @emitter.on "game.epic.start", (game) =>
      @epicModeStarted(game)

    @emitter.on "game.epic.end", (game)  =>
      @epicModeCompleted(game)
      
    @emitter.on "game.level.report", ({grade, levelScore , timeBonus, clearBonus, scoreCalculation}) =>
      messages = []
      messages.push "Level Score: #{levelScore}"
      messages.push "Time Bonus:  #{timeBonus}"
      messages.push "Clear Bonus: #{clearBonus}" if clearBonus
      messages.push "Total Score: #{scoreCalculation} (#{grade})"
      @puts messages.join("<br/>")

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

  epicModeStarted: (game) ->
    
  epicModeCompleted: (game) ->
    
  setWarriorAbilities: (abilities) ->
    
  clear: ->
    # clear screen
    
  onError: (e) ->
    console.trace(e)
    @puts "Error: #{e}"

root = exports ? window
root.View = View