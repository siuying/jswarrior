{View} = require('./view')
{_} = require 'underscore'

class ConsoleView extends View  
  puts: (text) -> 
    console.log(text)

  levelChanged: (level) ->
    console.log(" - Turn #{level.currentTurn} - ")
    console.log(level.floor.character())

  setWarriorAbilities: (abilities) ->
    @puts "Warrior Abilities:"
    for abilityName in _.keys(abilities)
      ability = level.warrior.abilities[abilityName]
      @puts "  warrior.#{abilityName}()"
      @puts "    #{ability.description()}"      

root = exports ? window
root.ConsoleView = ConsoleView