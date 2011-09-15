#  ----
# |ssC>|
# |@sss|
# |ssC |
#  ----


exports.level = ->

  @description "Never before have you seen a room so full of sludge. Start the fireworks!"
  @tip "Be careful not to let the ticking captive get caught in the flames. Use warrior.distanceOf() to avoid the captives."
  @clue "Be sure to bind the surrounding enemies before fighting. Check your health before detonating explosives."

  @time_bonus 70
  @size 4, 3
  @stairs 3, 0

  @warrior 0, 1, 'east', ->
    @add_abilities 'walk', 'feel', 'directionOfStairs', 'attack', 'health', 'rest', 'rescue', 'bind', 'listen', 'directionOf', 'look', 'detonate'
    @add_abilities 'distanceOf'

  @unit 'captive', 2, 0, 'south', ->
    @add_abilities 'explode'
    @abilities['explode'].time = 20

  @unit 'captive', 2, 2, 'north'

  @unit 'sludge', 0, 0, 'south'
  @unit 'sludge', 1, 0, 'south'
  @unit 'sludge', 1, 1, 'east'
  @unit 'sludge', 2, 1, 'east'
  @unit 'sludge', 3, 1, 'east'
  @unit 'sludge', 0, 2, 'north'
  @unit 'sludge', 1, 2, 'north'