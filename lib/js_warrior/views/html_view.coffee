{View} = require('./view')

class HtmlView extends View  
  constructor: (@emitter, $)->
    @$ = $

  puts: (text) -> 
    @$("#message").prepend("<p>#{text}</p>")

  levelChanged: (level) ->
    @$("#tower").html("<pre>#{level.floor.character()} </pre>")
    @$("#tower").prepend("<p> - Turn #{level.currentTurn} - </p>")

root = exports ? window
root.HtmlView = HtmlView