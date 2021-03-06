{Utils} = require('../utils')
{_} = require('underscore')

{Abilities} = require('../abilities')
{Turn} = require('../turn')


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
      @say "take #{amount} damage, #{@health} health power left"

      if @health <= 0
        @position = null
        @say "dies"

  isAlive: ->
    @position != undefined && @position != null
  
  isBound: ->
    @bound

  unbind: ->
    @say "release from bonds"
    @bound = false
  
  bind: ->
    @bound = true
    
  say: (msg) ->
    @emitter.emit('unit.say', @name(), msg) if @emitter

  name: ->
    @constructor.name.replace("_", " ").replace(/^(.[a-z_ ]+)([A-Z])(.+)/, "$1 $2$3")
  
  toString: ->
    @name()
  
  addAbilities: (new_abilities...) ->
    @abilities = @getAbilities()
    for ability in new_abilities
      camelAbility = Utils.toCamelCase(ability)
      try
        @abilities[ability] = eval("new Abilities.#{camelAbility}()")
        @abilities[ability].unit = this
      catch e  
        throw "BaseUnit.addAbilities: Unexpected ability: #{ability} #{e}"
  
  add_abilities: (new_abilities...) ->
    @addAbilities(new_abilities...)

  nextTurn: ->
    new Turn(@abilities)
  
  prepareTurn: ->
    @currentTurn = @nextTurn()
    @playTurn(@currentTurn)
  
  performTurn: ->
    if @position
      for ability in _.values(@getAbilities())
        ability.passTurn()

      if @currentTurn.action && !@isBound()
        [name, args] = @currentTurn.action
        args = null if args && args.length == 0
        @abilities[name].perform(args...)
  
  playTurn: (turn) ->
    
  getAbilities: ->
    @abilities ||= {}
  
  character: ->
    "?"

root = exports ? window
root.BaseUnit = BaseUnit
        