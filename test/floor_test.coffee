vows = require('vows')
assert = require('assert')
{JsWarrior} = require('../lib/js_warrior')

vows.describe('Floor').addBatch(
  'Initialize': 
    'topic': new JsWarrior.Floor()
    'created properly': (floor) ->
      assert.equal(floor.width, 0)
      assert.equal(floor.height, 0)
      assert.deepEqual(floor.stairs_location, [-1, -1])  

  'With floor 2x3':
    'topic': ->
      floor = new JsWarrior.Floor()
      floor.width = 2
      floor.height = 3
      floor.place_stairs(3, 3)
      floor

    'if add a unit, able to fetch it at that position': (floor) ->
      unit = new JsWarrior.Units.Base()
      floor.add(unit, 0, 1, 'north')
      assert.equal(floor.get(0, 1), unit)
  
    'if no position should not consider unit on floor': (floor) ->
      unit = new JsWarrior.Units.Base()
      floor.add(unit, 0, 1, 'north')
      unit.position = null
      assert.equal(floor.units().indexOf(unit), -1)
      
    'should fetch other units not warrior': (floor) ->
      unit = new JsWarrior.Units.Base()
      floor.add(unit, 0, 1, 'north')
      assert.notEqual(floor.other_units().indexOf(unit), -1)

    'should not consider corners out of bounds': (floor) ->
      assert.equal(floor.isOutOfBounds(0, 0), false)
      assert.equal(floor.isOutOfBounds(1, 0), false)
      assert.equal(floor.isOutOfBounds(1, 2), false)
      assert.equal(floor.isOutOfBounds(0, 2), false)

    'should consider out of bounds when going beyond sides': (floor) ->
      assert.equal(floor.isOutOfBounds(-1, 0), true)
      assert.equal(floor.isOutOfBounds(0, -1), true)
      assert.equal(floor.isOutOfBounds(0, 3), true)
      assert.equal(floor.isOutOfBounds(2, 0), true)
      
    'should return space at the specified location': (floor) ->
      assert.equal(floor.space(0, 0).constructor.name, "Space")
    
    'should place stairs and be able to fetch the location': (floor) ->
      floor.place_stairs(1, 2)
      assert.deepEqual(floor.stairs_location, [1, 2])

  'With floor 3x1': 
    'topic': ->
      floor = new JsWarrior.Floor()
      floor.width = 3
      floor.height = 1
      floor
    
    'should return unique units': (floor) ->
      unit = new JsWarrior.Units.Base()
      unit2 = new JsWarrior.Units.Base()
      floor.add(unit, 0, 0)
      floor.add(unit2, 1, 0)      
      assert.equal(floor.unique_units().length, 1)

).export(module);