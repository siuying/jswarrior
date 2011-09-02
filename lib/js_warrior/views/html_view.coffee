{View} = require('./view')
{_} = require('underscore')

class HtmlView extends View  
  constructor: (@emitter, $)->
    @$ = $
    @puts "Welcome to Coffee Warrior"

  puts: (text) -> 
    @$("#message").prepend("<p>#{text}</p>")

  levelLoaded: (level) ->
    # Redraw Level
    @levelChanged(level)
    
    # Add Hints
    @$("#hint_message").html("<p>#{level.tip}</p>")
    @setWarriorAbilities(level.warrior.abilities)    
    @$("#more_hint_message").html("<p>#{level.clue}</p>") if level.clue
    @$("#message").prepend("<p>#{level.description}</p>")

  levelChanged: (level) ->
    @$("#tower").html("")
    @$("#tower").append("<p--------------------------------------------</p>")

    tower = level.profile.towerPath.toUpperCase()
    if level.profile.isEpic()
      score = level.profile.currentEpicScore
      epic = "(EPIC)"
    else
      score = level.profile.score
      epic = ""

    @$("#tower").append("<p>#{tower}  Lvl #{level.number} #{epic}<br/>
    HP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#{level.warrior.health}/#{level.warrior.maxHealth()}<br/>
    Score&nbsp;&nbsp;#{score}</p>")
    @$("#tower").append("<p--------------------------------------------</p>")
    @$("#tower").append("<pre>#{level.floor.character()} </pre>")
    @$("#tower").append("<p--------------------------------------------</p>")

  setWarriorAbilities: (abilities) ->
    @$("#hint_message").append("<p>Warrior Abilities:</p>")
    for abilityName in _.keys(abilities)
      ability = abilities[abilityName]
      @$("#hint_message").append("<div class='ability'><p class='ability-label'>warrior.#{abilityName}()</p>
<p class='ability-details'>#{ability.description()}</p></div>")    

  levelCompleted: (level) ->
    @puts "Success! You have found the stairs."

  levelStarted: (level) ->
    @puts "Starting Level #{level.number}"

  epicModeStarted: (game) ->
    
  epicModeCompleted: (game) ->
    @puts game.finalReport()

  clear: ->
    @$("#message").html("")

root = exports ? window
root.HtmlView = HtmlView