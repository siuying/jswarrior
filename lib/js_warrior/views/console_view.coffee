{View} = require('./view')

class ConsoleView extends View  
  puts: (text) -> 
    console.log(text)

  levelChanged: (level) ->
    console.log(" - Turn #{level.currentTurn} - ")
    console.log(level.floor.character())

root = exports ? window
root.ConsoleView = ConsoleView