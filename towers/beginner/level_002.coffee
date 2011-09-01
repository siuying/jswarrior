#  --------
# |@   s  >|
#  --------

exports.level = ->
  @description "It is too dark to see anything, but you smell sludge nearby."
  @tip "Use warrior.feel().isEmpty() to see if there's anything in front of you, and warrior.attack() to fight it. Remember, you can only do one action per turn."
  @clue "Add an if/else condition using warrior.feel().isEmpty() to decide whether to warrior.attack() or warrior.walk!."

  @time_bonus 20
  @ace_score 26
  @size 8, 1
  @stairs 7, 0

  @warrior 0, 0, 'east', ->
    @add_abilities 'walk', 'feel', 'attack'

  @unit 'sludge', 4, 0, 'west'