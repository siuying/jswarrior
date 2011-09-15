vows = require('vows')
assert = require('assert')
{_} = require('underscore')
{JsWarrior} = require('../../lib/js_warrior')

vows.describe('Direction of').addBatch(
  'Test': 
    'topic': ->
      floor = new JsWarrior.Floor()
      floor.width = 10
      floor.height = 1
      floor.placeStairs(8, 0)
      unit = new JsWarrior.Units.BaseUnit()
      unit.addAbilities('direction_of')
      floor.add(unit, 0, 0, 'east')
      {floor, unit}

    "should return relative direction of stairs": ({floor, unit}) ->
      assert.isNotNull unit.abilities['direction_of']
      assert.isNotNull unit.abilities['direction_of'].perform(floor.space(8, 0))
      assert.equal unit.abilities['direction_of'].perform(floor.space(8, 0)), 'forward'
      
).export(module);