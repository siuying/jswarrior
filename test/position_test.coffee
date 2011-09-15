vows = require('vows')
assert = require('assert')

{JsWarrior} = require('../lib/js_warrior')

vows.describe('Position').addBatch(
  'Initialize': 
    'topic': new JsWarrior.Position([], 1, 2)

    'faced north': (position) ->
      assert.equal(position.direction(), 'north')

    'position at [1,2]': (position) ->
      assert.equal(position.x, 1)
      assert.equal(position.y, 2)

  'Check if at a position':
    'topic': new JsWarrior.Position([], 1, 2)

    'at() return properly properly': (position) ->
      assert.equal(position.at(1,2), true)
      assert.equal(position.at(2,2), false)

  'More Position Tests': 
    'topic': ->
      unit = new JsWarrior.Units.BaseUnit()
      floor = new JsWarrior.Floor()
      floor.width = 6
      floor.height = 5
      floor.add(unit, 1, 2, 'north')
      position = unit.position
      {unit, floor, position}

    "should return relative direction of stairs": ({unit, floor, position}) ->
      floor.placeStairs(0,0)
      assert.equal position.relativeDirectionOfStairs(), 'forward'
      
    "should return relative direction of given space": ({unit, floor, position}) ->
      assert.equal position.relativeDirectionOf(floor.space(5, 3)), 'right'
      position.rotate(1)
      assert.equal position.relativeDirectionOf(floor.space(1, 4)), 'right'

    "should return a space at the same location as position": ({unit, floor, position}) ->
      assert.deepEqual position.space().location(), [1, 2]
).export(module);