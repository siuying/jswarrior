{View} = require('./view')

class HtmlView extends View  
  constructor: (@emitter, $)->
    @$ = $
    @puts "Welcome to JS Warrior"

  puts: (text) -> 
    @$("#message").prepend("<p>#{text}</p>")

  levelLoaded: (level) ->
    @levelChanged(level)
    @$("#hint_message").html("<p>#{level.tip}</p>")
    @$("#more_hint_message").html("<p>#{level.clue}</p>") if level.clue
    @$("#message").prepend("<p>#{level.description}</p>")

  levelChanged: (level) ->
    @$("#tower").html("")
    @$("#tower").append("<p--------------------------------------------</p>")
    @$("#tower").append("<p>Lvl #{level.number}</p>")
    @$("#tower").append("<p>HP  #{level.warrior.health}/#{level.warrior.maxHealth()}</p>")
    @$("#tower").append("<p--------------------------------------------</p>")
    @$("#tower").append("<pre>#{level.floor.character()} </pre>")
    @$("#tower").append("<p--------------------------------------------</p>")
    
  levelCompleted: (level) ->
    @puts "Success! You have found the stairs."

  levelStarted: (level) ->
    @puts "Starting Level #{level.number}"

  clear: ->
    @$("#message").html("")

root = exports ? window
root.HtmlView = HtmlView