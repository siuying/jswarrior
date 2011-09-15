#  ----
# |C s |
# | @ S|
# |C s>|
#  ----

exports.level = ->

  @description "Your ears become more in tune with the surroundings. Listen to find enemies and captives!"
  @tip "Use warrior.listen() to find spaces with other units, and warrior.directionOf() to determine what direction they're in."
  @clue "Walk towards an enemy or captive with warrior.walk(warrior.directionOf(warrior.listen()[0])), once warrior.listen().length == 0 then head for the stairs."

  @time_bonus 55
  @ace_score 144
  @size 4, 3
  @stairs 3, 2

  @warrior 1, 1, 'east', ->
    @add_abilities 'walk', 'feel', 'directionOfStairs', 'attack', 'health', 'rest', 'rescue', 'bind'
    @add_abilities 'listen', 'directionOf'

  @unit 'captive', 0, 0, 'east'
  @unit 'captive', 0, 2, 'east'
  @unit 'sludge', 2, 0, 'south'
  @unit 'thick_sludge', 3, 1, 'west'
  @unit 'sludge', 2, 2, 'north'
