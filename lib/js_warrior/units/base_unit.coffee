{EventEmitter} = require 'events'
{Abilities} = require('../abilities')
{_} = require('underscore')

class BaseUnit
  constructor: (@health, @position) ->
    @health ||= @maxHealth()
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
    @emitter?.emit 'unit.say', [@name, @message]

  name: ->
    @constructor.name
  
  toString: ->
    @name()
  
  addAbilities: (new_abilities...) ->
    abilities = @getAbilities()
    for ability in new_abilities
      camelAbility = ability.replace(/([a-z])/, ($1) -> $1.toUpperCase())
      try
        abilities[ability] = eval("new Abilities.#{camelAbility}()")
      catch e
        console.trace(e)      
        throw "BaseUnit.addAbilities: Unexpected ability: #{ability} #{e}"
      
  nextTurn: ->
    new Turn(abilities)
  
  prepareTurn: ->
    @currentTurn = @nextTurn()
    @playTurn(@currentTurn)
  
  performTurn: ->
    if @position
      for ability in _.values(@getAbilities())
        ability.passTurn()

      if @currentTurn.action && !@isBound()
        [name, args...] = @action()
        @abilities[name].perform(args)
  
  playTurn: (turn) ->
    
  getAbilities: ->
    @abilities ||= {}
  
  character: ->
    "?"

root = exports ? window
root.BaseUnit = BaseUnit
        