class ProcPlayer
  DIRECTIONS = ['north', 'east', 'south', 'west']
  RELATIVE_DIRECTIONS = ['forward', 'right', 'backward', 'left']
  
  playTurn: (warrior) ->
    # check if we are losing health
    losingHealth = @lastHealth > warrior.health()
    @lastHealth = warrior.health()

    # attack a direction if enemy exists
    for dir in RELATIVE_DIRECTIONS
      space = warrior.feel(dir)
      if space.isEnemy()
        warrior.attack()
        return

    # if need rest, rest
    if warrior.health() < 20 && !losingHealth
      warrior.rest()
      return
    
    warrior.walk('forward')
    

root = exports ? window
root.ProcPlayer = ProcPlayer