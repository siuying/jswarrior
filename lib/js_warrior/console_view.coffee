{View} = require('./view')

class ConsoleView extends View  
  puts: (text) -> 
    console.log(text)

root = exports ? window
root.ConsoleView = ConsoleView