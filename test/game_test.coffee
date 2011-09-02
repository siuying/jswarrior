vows = require('vows')
assert = require('assert')

{_} = require('underscore')
{JsWarrior} = require('../lib/js_warrior')

vows.describe('Game').addBatch(
  'Game Level': 
    'topic': ->
      new JsWarrior.Game()
      
).export(module);