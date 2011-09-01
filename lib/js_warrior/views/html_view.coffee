{View} = require('./view')

class HtmlView extends View  
  constructor: (@emitter, $)->
    @$ = $

  puts: (text) -> 
    @$("#message").prepend("<p>#{text}</p>")

  levelLoaded: (level) ->
    @levelChanged(level)
    @$("#hint_message").html("<p>#{level.tip}</p>")
    @$("#message").prepend("<p>#{level.description}</p>")

  levelChanged: (level) ->
    @$("#tower").html("")
    @$("#tower").append("<p>-------------------------------------------------------</p>")
    @$("#tower").append("<p>Level #{level.profile.levelNumber}</p>")
    @$("#tower").append("<pre>#{level.floor.character()} </pre>")
    @$("#tower").append("<p>-------------------------------------------------------</p>")
    
  levelCompleted: (level) ->
    @puts "Success! You have found the stairs."

  clear: ->
    @$("#message").html("")

root = exports ? window
root.HtmlView = HtmlView