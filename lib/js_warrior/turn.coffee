{Abilities} = require('./abilities')
{Utils} = require('./utils')
{_} = require('underscore')

class Turn
  constructor: (abilities={}) ->
    @action = null
    @senses = {}
    
    for name, params of abilities
      camelAbilityName = Utils.toCamelCase name
      ability = eval "new Abilities.#{camelAbilityName}()"
      if ability.isAction()
        @addAction(name)
      else
        @addSense(name, params)

  addAction: (action) ->
    eval "this.#{action} = function() { var __slice = Array.prototype.slice; var param; param = 1 <= arguments.length ? __slice.call(arguments, 0) : []; if (this.action) {throw 'You can only run one action per turn!'; } return this.action = ['#{action}', param]; };"

  addSense: (name, params) ->
    eval "this.#{name} = function(args) { return this.senses['#{name}'].perform(args); };"
    @senses[name] = params

root = exports ? window
root.Turn = Turn