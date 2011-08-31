{BaseUnit} = require('./base_unit')
{Golem} = require('./golem')

class Warrior extends BaseUnit
  constructor: ->
    @score = 0
    @golem_abilities = []
  
  playTurn: (turn) ->
    @player().playTurn(turn)
    
  player: ->
    @__player ||= Player.new
  
  earnPoints: (points) ->
    @score += points
    @say "earns #{points} points"
  
  attackPower: ->
    5

  shoot_power: ->
    3
  
  maxHealth: ->
    20
  
  name: ->
    if @__name != null && @__name != ""
      @__name
    else
      "Warrior"
  
  toString: ->
    @name()
  
  character: ->
    "@"
    
  performTurn: ->
    @say "does nothing" if @currentTurn.action == null
    super
  
  addGolemAbilities: (abilities...) ->
    @golemAbilities = abilities
  
  hasGolem: ->
    @golemAbilities != null && @golemAbilities.length > 0
  
  baseGolem: ->
    golem = Golem.new
    golem.addAbilities(@golemAbilities)
    golem

root = exports ? window
root.Warrior = Warrior
