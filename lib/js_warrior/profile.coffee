{Tower}     = require './tower'
{Level}     = require './level'
{Base64}    = require 'base64'
{_}         = require 'underscore'


class Profile
  constructor: (@emitter = null) ->
    @towerPath = "beginner"
    @warriorName = null
    @score = 0
    @abilities = []
    @levelNumber = 1
    @epic = false
    @lastLevelNumber = undefined
    @currentEpicScore = 0
    @currentEpicGrades = {}
    @epicScore = 0
    @sourceCode = null
    
  toString: ->
    [@warriorName, "level #{@levelNumber}", "score #{@score}"].join('-')
  
  tower: ->
    new Tower(@towerPath)
  
  currentLevel: ->
    new Level(this, @levelNumber, @emitter)
    
  nextLevel: ->
    new Level(this, @levelNumber + 1, @emitter)
  
  isEpic: ->
    @epic
  
  addAbilities: (newAbilities...) ->
    for ability in newAbilities
      @abilities.push(ability) if ability
    @abilities = _.uniq(@abilities)
  
  calculateAverageGrade: ->
    noOfGrades = _.values(@currentEpicGrades).length
    if noOfGrades > 0
      sum = 0.0
      for score in _.values(@currentEpicGrades)
        sum += score 
      sum / noOfGrades
    else
      0.0

  encode: ->
    Base64.encode(JSON.stringify(this))
  
  decode: (text) ->
    data = JSON.parse(Base64.decode(text))
    @towerPath = data.towerPath
    @warriorName = data.warriorName
    @score = data.score
    @abilities = data.abilities
    @levelNumber =  data.levelNumber
    @epic =  data.epic
    @lastLevelNumber = data.lastLevelNumber
    @currentEpicScore = data.currentEpicScore
    @currentEpicGrades = data.currentEpicGrades
    @epicScore = data.epicScore
    @sourceCode = data.sourceCode
    this
    
root = exports ? window
root.Profile = Profile