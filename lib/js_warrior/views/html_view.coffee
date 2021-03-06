{View}  = require './view'
{Utils} = require '../utils'
{_}     = require 'underscore'

class HtmlView extends View  
  constructor: (@emitter, $)->
    @$ = $
    @puts "Welcome to Coffee Warrior"

  puts: (text) -> 
    @$("#message").append("<p>#{text}</p>")
    @$("#message")[0].scrollTop = @$("#message")[0].scrollHeight

  levelLoaded: (level) ->
    # Redraw Level
    @levelChanged(level)

    # Add Hints
    @$("#hint_message").html("<p>#{level.tip}</p>")
    @setWarriorAbilities(level.warrior.abilities)    
    @$("#more_hint_message").html("<p>#{level.clue}</p>") if level.clue
    @puts "===== Level #{level.number} ====="
    @puts level.description

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

    @$("#tower").append("<p>Tower&nbsp;&nbsp;#{tower} #{epic}<br/>
    Lvl&nbsp;&nbsp;&nbsp;&nbsp;#{level.number}<br/>
    HP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#{level.warrior.health}/#{level.warrior.maxHealth()}<br/>
    Score&nbsp;&nbsp;#{score}</p>")
    @$("#tower").append("<p--------------------------------------------</p>")
    @$("#tower").append("<pre>#{level.floor.character()} </pre>")
    @$("#tower").append("<p--------------------------------------------</p>")
    
    units = ("#{unit.character()} - #{unit.name()} (HP: #{unit.health})" for unit in level.floor.units())
    units.push("> - Stair")
    @$("#tower").append("<p class='unit'>#{units.join("\n<br/>")}</p>")
    @$("#tower").append("<p--------------------------------------------</p>")
    
    @puts "- Turn #{level.currentTurn} -" if level.currentTurn > 0

    window.history.pushState {}, "Level #{level.number}", "##{level.profile.encode()}"

  setWarriorAbilities: (abilities) ->
    @$("#hint_message").append("<p>Warrior Abilities:</p>")
    for abilityName in _.keys(abilities)
      ability = abilities[abilityName]
      @$("#hint_message").append("<div class='ability'><p class='ability-label'>warrior.#{Utils.toMethodCase(abilityName)}()</p>
<p class='ability-details'>#{ability.description()}</p></div>")    

  levelCompleted: (level) ->
    @puts "Success! You have found the stairs."

  levelStarted: (level) ->
    @puts "Starting Level #{level.number}"

  epicModeStarted: (game) ->
    @puts "Click Run again to play epic mode."

  epicModeCompleted: (game) ->
    @puts game.finalReport()

  clear: ->
    @$("#message").html("")
  
  title: ->
    "  _____     ______          _      __             _         
     / ___/__  / _/ _/__ ___   | | /| / /__ _________(_)__  ____
    / /__/ _ \/ _/ _/ -_) -_)  | |/ |/ / _ `/ __/ __/ / _ \/ __/
    \___/\___/_//_/ \__/\__/   |__/|__/\_,_/_/ /_/ /_/\___/_/   
    "

root = exports ? window
root.HtmlView = HtmlView