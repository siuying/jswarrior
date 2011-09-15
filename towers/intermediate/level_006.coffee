#  ------
# |Cs   >|
# |@  sC |
#  ------

exports.level = ->
  @description "What's that ticking? Some captives have a timed bomb at their feet!"
  @tip "Hurry and rescue captives first that have space.isTicking(), they'll soon go!"
  @clue "Avoid fighting enemies at first. Use warrior.listen() and space.isTicking() and quickly rescue those captives."

  @time_bonus 50
  @ace_score 108
  @size 6, 2
  @stairs 5, 0

  @warrior 0, 1, 'east', ->
    @add_abilities 'walk', 'feel', 'direction_of_stairs'
    @add_abilities 'attack', 'health', 'rest'
    @add_abilities 'rescue', 'bind'
    @add_abilities 'listen', 'direction_of'

  @unit 'sludge', 1, 0, 'west'
  @unit 'sludge', 3, 1, 'west'
  @unit 'captive', 0, 0, 'west'
  @unit 'captive', 4, 1, 'west', ->
    @add_abilities 'explode'
    @abilities['explode'].time = 7