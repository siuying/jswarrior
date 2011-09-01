#  ---------
# |@ s ss s>|
#  ---------

exports.level = ->
  @description "The air feels thicker than before. There must be a horde of sludge."
  @tip "Be careful not to die! Use warrior.health() to keep an eye on your health, and warrior.rest() to earn 10% of max health back."
  @clue "When there's no enemy ahead of you, call warrior.rest() until health is full before walking forward."

  @timeBonus 35
  @aceScore 71
  @size 9, 1
  @stairs 8, 0

  @warrior 0, 0, 'east', ->
    @addAbilities 'walk', 'feel', 'attack', 'health', 'rest'

  @unit 'sludge', 2, 0, 'west'
  @unit 'sludge', 4, 0, 'west'
  @unit 'sludge', 5, 0, 'west'
  @unit 'sludge', 7, 0, 'west'
