#  -------
# |@ Ss C>|
#  -------


exports.level = ->

  @description "You discover a satchel of bombs which will help when facing a mob of enemies."
  @tip "Detonate a bomb when you see a couple enemies ahead of you (warrior.look()). Watch out for your health too."
  @clue "Calling warrior.look will return an array of Spaces. If the first two contain enemies, detonate a bomb with warrior.detonate()."

  @time_bonus 30
  @size 7, 1
  @stairs 6, 0

  @warrior 0, 0, 'east', ->
    @add_abilities 'walk', 'feel', 'directionOfStairs', 'attack', 'health', 'rest', 'rescue', 'bind', 'listen', 'directionOf'
    @add_abilities 'look', 'detonate'

  @unit 'captive', 5, 0, 'west', ->
    @add_abilities 'explode'
    @abilities['explode'].time = 9

  @unit 'thick_sludge', 2, 0, 'west'
  @unit 'sludge', 3, 0, 'west'
