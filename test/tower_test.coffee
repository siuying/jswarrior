vows = require('vows')
assert = require('assert')
{JsWarrior} = require('../lib/js_warrior')

vows.describe('Tower').addBatch(
  'loaded tower from path':
    'topic': ->
      new JsWarrior.Tower('path/to/tower')

    'should have correct name': (tower) ->
      assert.equal(tower.name(), 'tower')
      
    'should use name when converting to string': (tower) ->
      assert.equal(tower.toString(), tower.name())

).export(module);