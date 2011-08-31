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
    eval "this.#{action} = function() { var param; param = 1 <= arguments.length ? __slice.call(arguments, 0) : []; return this.action = ['#{action}', param]; };"

  addSense: (name, params) ->
    eval "this.#{name} = function(args) { return this.senses['#{action}'] = args; };"
    @senses[name] = params

root = exports ? window
root.Turn = Turn