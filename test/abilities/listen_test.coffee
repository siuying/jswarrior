vows = require('vows')
assert = require('assert')
{_} = require('underscore')
{JsWarrior} = require('../../lib/js_warrior')

vows.describe('Listen').addBatch(
  'Listening': 
    'topic': ->
      profile = new JsWarrior.Profile()
      level = new JsWarrior.Level(profile, 1)
      loader = new JsWarrior.LevelLoader(level)      
      profile: profile
      level: level
      loader: loader

    "should get 5 objects from listen": ({loader, level, profile}) ->
      warrior = loader.warrior 0, 0, 'east', (u) ->
        u.add_abilities 'listen'

      unit1 = loader.unit('archer',   1,  0, 'east')
      unit2 = loader.unit('captive',  2, 0, 'west')
      unit3 = loader.unit('sludge',   3, 0, 'west')
      unit4 = loader.unit('wizard',   4, 0, 'west')
      
      units = warrior.abilities['listen'].perform()
      assert.length units, 4
      assert.equal(units.indexOf(unit1) > -1, true, "should listened unit 1")
      assert.equal(units.indexOf(unit2) > -1, true, "should listened unit 2")
      assert.equal(units.indexOf(unit3) > -1, true, "should listened unit 3")
      assert.equal(units.indexOf(unit4) > -1, true, "should listened unit 4")
      assert.equal(units.indexOf(warrior) > -1, false, "should not listened warrior")

).export(module);