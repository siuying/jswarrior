vows = require('vows')
assert = require('assert')
{JsWarrior} = require('../lib/js_warrior')

vows.describe('Utils').addBatch(
  'Using toCamelCase':
    'topic': ->
      JsWarrior.Utils.toCamelCase('path_to_tower')

    'should return camel case word': (str) ->
      assert.equal(str, 'PathToTower')
  
  'Using basename':
    'topic': ->
      JsWarrior.Utils.basename('path/to/tower')
    'should return basename': (str) ->
      assert.equal(str, 'tower')
  
  'Using lpad':
    'topic': ->
      JsWarrior.Utils.lpad('1', '0', 5)

    'should return basename': (str) ->
      assert.equal(str, '00001')
      
  'Using rpad':
    'topic': ->
      JsWarrior.Utils.rpad('1', '0', 5)

    'should return basename': (str) ->
      assert.equal(str, '10000')

).export(module);