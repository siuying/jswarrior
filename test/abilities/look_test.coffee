vows = require('vows')
assert = require('assert')
{_} = require('underscore')
{JsWarrior} = require('../../lib/js_warrior')

vows.describe('Look').addBatch(
  'Looking': 
    'topic': ->
      profile = new JsWarrior.Profile()
      level = new JsWarrior.Level(profile, 1)
      loader = new JsWarrior.LevelLoader(level)      
      profile: profile
      level: level
      loader: loader

    "should get 3 objects at position from offset": ({loader, level, profile}) ->
      loader.size(8, 1)
      unit1 = loader.unit('archer',   1,  0, 'east')
      unit2 = loader.unit('captive',  2, 0, 'west')
      unit3 = loader.unit('sludge',   3, 0, 'west')
      unit4 = loader.unit('wizard',   4, 0, 'west')
      
      [s2, s3, s4] = unit1.abilities['look'].perform('forward')
      assert.equal(s2.getUnit().name(), 'Captive')
      assert.equal(s3.getUnit().name(), 'Sludge')
      assert.equal(s4.getUnit().name(), 'Wizard')
      
      [s3, s2, s1] = unit4.abilities['look'].perform('forward')
      assert.equal(s3.getUnit().name(), 'Sludge')
      assert.equal(s2.getUnit().name(), 'Captive')
      assert.equal(s1.getUnit().name(), 'Archer')

).export(module);