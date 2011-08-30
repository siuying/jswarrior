{EventEmitter} = require 'events'
	
class Base
  constructor: (@health, @position) ->
    @health ||= @max_health()
    @event = new EventEmitter
    @bound = false
    
  attack_power: ->
    0
  
  max_health: ->
    0
    
  earn_points: (point) ->
    undefined

  take_damage: (amount) ->
    @unbind() if @isBound()
    if @health
      @health -= amount
      @say "take #{@amount} damage, #{@health} health power left"
      if @health <= 0
        @position = null
        @say "dies"
  
  isAlive: ->
    @position != undefined
  
  isBound: ->
    @bound
  
  unbind: ->
    @say "release from bonds"
    @bound = false
  
  bind: ->
    @bound = true
    
  say: (msg) ->
    @event.emit 'unit.say', [@name, @message]

  name: ->
    @constructor.name
  
  to_s: ->
    @name()
  
  add_abilities: (new_abilities...) ->
    for ability in new_abilities
      @abilities[ability] = eval("new #{ability}")
      
  next_turn: ->
    new Turn(abilities)
  
  prepare_turn: ->
    @current_turn = @next_turn
    @play_turn(@current_turn)
  
  perform_turn: ->
    if @position
      for ability in @abilities
        ability.pass_turn
      if @current_turn.action && !@isBound
        [name, args...] = @current_turn.action()
        !@abilities[name].perform(args)
  
  play_turn: (turn) ->
    
  abilities: ->
    @abilities ||= {}
  
  character: ->
    "?"

root = exports ? window
root.Base = Base
        