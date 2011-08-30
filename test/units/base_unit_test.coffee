vows = require('vows')
assert = require('assert')

{JsWarrior} = require('../../lib/js_warrior')

vows.describe('Base').addBatch(
  'with empty space': 
    'topic': -> new JsWarrior.Units.Base()

    'should have an attack power which defaults to zero': (unit) ->
      assert.equal(unit.attack_power(), 0)
    
    'should consider itself dead when no position': (unit) ->
      assert.equal(unit.position, null)
      assert.equal(unit.isAlive(), false)
      
    'should consider itself alive with position': (unit) ->
      unit.position = new JsWarrior.Position()
      assert.equal(unit.isAlive(), true)
    
    'should default max health to 10': (unit) ->
      assert.equal(unit.max_health(), 0)
      
    'should do nothing when earning points': (unit) ->
      assert.doesNotThrow(-> unit.earn_points(10))

    'should default health to max health': (unit) ->
      class StubUnit extends JsWarrior.Units.Base
        max_health: ->
          10
      sunit = new StubUnit
      assert.equal(sunit.health, 10)

    'should substract health when taking damage': (unit) -> 
      class StubUnit extends JsWarrior.Units.Base
        max_health: ->
          10
      unit = new StubUnit
      unit.take_damage(3)
      assert.equal(unit.health, 7)
    
    'should do nothing when taking damage if health isnt set': (unit) ->
      assert.doesNotThrow(-> unit.take_damage(10))
    
    'should set position to nil when running out of health': (unit) ->
      class StubUnit extends JsWarrior.Units.Base
        max_health: ->
          10
      unit = new StubUnit
      unit.take_damage(10)
      assert.equal(unit.position, null)
      
    'should return name in to_s': (unit) ->
      assert.equal(unit.name(), 'Base')
      assert.equal(unit.to_s(), 'Base')
    
    'should appear as question mark on map': (unit) ->
      assert.equal(unit.character(), '?')
      
    'should be released from bounds when taking damage': (unit) ->
      class StubUnit extends JsWarrior.Units.Base
        max_health: ->
          10
      unit = new StubUnit
      unit.bind()
      assert.equal(unit.isBound(), true)
      unit.take_damage(3)
      assert.equal(unit.isBound(), false)
      
    'should be released from bonds when calling release': (unit) ->
      unit.bind()
      unit.unbind()
      assert.equal(unit.isBound(), false)
      
).export(module);