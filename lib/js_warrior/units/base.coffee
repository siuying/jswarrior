{EventEmitter} = require 'events'
{Abilities} = require('../abilities')

class Base
  constructor: (@health, @position) ->
    @health ||= @maxHealth()
    @event = new EventEmitter
    @bound = false
    
  attackPower: ->
    0
  
  maxHealth: ->
    0
    
  earnPoints: (point) ->
    undefined

  takeDamage: (amount) ->
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
  
  addAbilities: (new_abilities...) ->
    for ability in new_abilities
      camelAbility = ability.replace(/([a-z])/, ($1) -> $1.toUpperCase())
      try
        @abilities[ability] = eval("new Abilities.#{camelAbility}()")
      catch e
        throw "unexpected ability: #{ability}"
      
  nextTurn: ->
    new Turn(abilities)
  
  prepare_turn: ->
    @currentTurn = @nextTurn()
    @play_turn(@currentTurn)
  
  perform_turn: ->
    if @position
      for ability of @abilities().keys()
        ability.pass_turn

      if @currentTurn.action && !@isBound()
        [name, args...] = @action()
        @abilities()[name].perform(args)
  
  play_turn: (turn) ->
    
  abilities: ->
    @__abilities ||= {}
  
  character: ->
    "?"

root = exports ? window
root.Base = Base
        