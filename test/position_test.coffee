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

).export(module);