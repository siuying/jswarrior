vows = require('vows')
assert = require('assert')
{JsWarrior} = require('../lib/js_warrior')

vows.describe('Space').addBatch(
  'with empty space': 
    'topic': ->
      floor = new JsWarrior.Floor()
      floor.width = 2
      floor.height = 3
      floor.space(0, 0)

    'should not be enemy': (space) ->
      assert.equal(space.isEnemy(), false)
    
    'should not be warrior': (space) ->
      assert.equal(space.isWarrior(), false)
      
    'should be empty': (space) ->
      assert.equal(space.isEmpty(), true)
    
    'should not be wall': (space) ->
      assert.equal(space.isWall(), false)
    
    'should not be stairs': (space) ->
      assert.equal(space.isStairs(), false)
    
    'should not be captive': (space) ->
      assert.equal(space.isCaptive(), false)
      
    "should have name 'nothing'": (space) ->
      assert.equal(space.toString(), "nothing")
      
    "should not be ticking": (space) ->
      assert.equal(space.isTicking(), false)
  
  'out of bounds':
    'topic': ->
      floor = new JsWarrior.Floor()
      floor.space(-1, 1)
    
    'should be wall': (space) ->
      assert.equal(space.isWall(), true)
    
    'should not be empty': (space) ->
      assert.equal(space.isEmpty(), false)

    'should have name of "wall"': (space) ->
      assert.equal(space.toString(), 'wall')
      
  'with warrior':
    'topic': ->
      floor = new JsWarrior.Floor()
      floor.width = 2
      floor.height = 3
      warrior = new JsWarrior.Units.Warrior()
      floor.add(warrior, 0, 0)
      floor.space(0, 0)
      
    'should be a warrior': (space) ->
      assert.equal(space.isWarrior(), true)
    
    'should not be enemy': (space) ->
      assert.equal(space.isEnemy(), false)
      
    'should not be empty': (space) ->
      assert.equal(space.isEmpty(), false)
      
  'with enemy':
    'topic': ->
      floor = new JsWarrior.Floor()
      floor.width = 2
      floor.height = 3
      sludge = new JsWarrior.Units.Sludge()
      floor.add(sludge, 0, 0)
      floor.space(0, 0)

    'should not be warrior': (space) ->
      assert.equal(space.isWarrior(), false)

    'should be enemy': (space) ->
      assert.equal(space.isEnemy(), true)

    'should not be empty': (space) ->
      assert.equal(space.isEmpty(), false)
    
    'should have name of unit': (space) ->
      assert.equal(space.toString(), 'Sludge')
      
    'bounded enemy':
      'topic': ->
        floor = new JsWarrior.Floor()
        floor.width = 2
        floor.height = 3
        sludge = new JsWarrior.Units.Sludge()
        floor.add(sludge, 0, 0)
        sludge.bind()
        floor.space(0, 0)
      
      'should be captive': (space) ->
        assert.equal(space.isCaptive(), true)
      
      'should not look like enemy': (space) ->
        assert.equal(space.isEnemy(), false)

  'with captive':
    'topic': ->
      floor = new JsWarrior.Floor()
      floor.width = 2
      floor.height = 3
      cap = new JsWarrior.Units.Captive()
      floor.add(cap, 0, 0)
      floor.space(0, 0)
      
    'should be captive': (space) ->
      assert.equal(space.isCaptive(), true)
      
    'should not be enemy': (space) ->
      assert.equal(space.isEnemy(), false)
    
    'should be ticking if captive has time bomb': (space) ->
      space.unit().addAbilities('explode')
      assert.equal(space.isTicking(), true)
  
  'with golem': ->
    'topic': ->
      floor = new JsWarrior.Floor()
      floor.width = 2
      floor.height = 3
      golem = new JsWarrior.Units.Golem()
      floor.add(golem, 0, 0)
      floor.space(0, 0)
    'should be a golem': (space) ->
      asset.equal(space.isGolem(), true)
    'should not be enemy': (space) ->
      asset.equal(space.isEnemy(), false)
    'should be a player': (space) ->
      asset.equal(space.isPlayer(), true)
      
  'at stairs': 
    'topic': ->
      floor = new JsWarrior.Floor()
      floor.width = 2
      floor.height = 3
      floor.placeStairs(0, 0)
      floor.space(0, 0)
    
    'should be empty': (space) ->
      assert.equal(space.isEmpty(), true)

    'should be stairs': (space) ->
      assert.equal(space.isStairs(), true)

  
).export(module);