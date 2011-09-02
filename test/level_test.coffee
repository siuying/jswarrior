vows = require('vows')
assert = require('assert')

{_} = require('underscore')
{JsWarrior} = require('../lib/js_warrior')

vows.describe('Floor').addBatch(
  'Floor': 
    'topic': ->
      profile = new JsWarrior.Profile()
      floor = new JsWarrior.Floor(1)
      level = new JsWarrior.Level(profile, 1)
      level.floor = floor
      profile: profile
      floor: floor
      level: level
      
    'should consider passed when warrior is on stairs': ({level, floor}) ->
      level.warrior = new JsWarrior.Units.Warrior()
      floor.add(level.warrior, 0, 0)
      floor.placeStairs(0, 0)
      assert.equal(level.isPassed(), true)
    
    "should default time bonus to zero": ({level}) ->
      assert.equal(level.timeBonus, 0)
      
    "should setup warrior with profile abilities": ({level, profile}) ->
      profile.abilities = ['attack']
      level.warrior = new JsWarrior.Units.Warrior()
      level.setupWarrior(level.warrior)
      assert.equal(_.keys(level.warrior.getAbilities()).indexOf('attack') > -1, true)

    "should setup warrior name with profile name": ({profile, level}) ->
      profile.warriorName = "Joe"
      level.warrior = new JsWarrior.Units.Warrior()
      level.setupWarrior(level.warrior)
      assert.equal(level.warrior.name(), "Joe")

  'Attempt loading non existing level': 
    'topic': ->
      profile = new JsWarrior.Profile()
      floor = new JsWarrior.Floor(11)
      level = new JsWarrior.Level(profile, 11)
      level.floor = floor
      profile: profile
      floor: floor
      level: level

    "should return false on isExists()": ({level}) ->
      assert.equal(level.isExists(), false)
      
).export(module);