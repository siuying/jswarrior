class ProcPlayer
  DIRECTIONS = ['north', 'east', 'south', 'west']
  RELATIVE_DIRECTIONS = ['forward', 'right', 'backward', 'left']

  playTurn: (warrior) ->
    # attack a direction if enemy exists
    for dir in RELATIVE_DIRECTIONS
      space = warrior.feel(dir)
      if space.isEnemy()
        warrior.attack()
        return
    
    # if need rest, rest
    if warrior.health() < 20
      warrior.rest()
      return
    
    warrior.walk('forward')

root = exports ? window
root.ProcPlayer = ProcPlayer