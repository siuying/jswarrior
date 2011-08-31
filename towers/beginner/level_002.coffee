#  --------
# |@   s  >|
#  --------

exports.level = ->
  @description "It is too dark to see anything, but you smell sludge nearby."
  @tip "Use warrior.feel.empty? to see if there's anything in front of you, and warrior.attack! to fight it. Remember, you can only do one action (ending in !) per turn."
  @clue "Add an if/else condition using warrior.feel.empty? to decide whether to warrior.attack! or warrior.walk!."

  @timeBonus 20
  @aceScore 26
  @size 8, 1
  @stairs 7, 0

  @warrior 0, 0, 'east', ->
    @addAbilities 'walk', 'feel', 'attack'

  @unit 'sludge', 4, 0, 'west'