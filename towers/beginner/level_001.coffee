# --------
# |@ >|
# --------

root = exports ? window
root.level = ->

  @description "You see before yourself a long hallway with stairs at the end. There is nothing in the way."
  @tip "Call warrior.walk to walk forward in the Player 'play_turn' method."

  @timeBonus 15
  @aceScore 10
  @size 8, 1
  @stairs 7, 0

  @warrior 0, 0, 'east', -> 
    @addAbilities 'walk'