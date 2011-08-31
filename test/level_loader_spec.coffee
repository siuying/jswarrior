vows = require('vows')
assert = require('assert')
{JsWarrior} = require('../lib/js_warrior')

vows.describe('LevelLoader').addBatch(
  'With Profile': 
    'topic': ->
      profile = new JsWarrior.Profile()
      level = new JsWarrior.Level(profile, 1)
      loader = new JsWarrior.LevelLoader(level)      
      profile: profile
      level: level
      loader: loader
  
    'should be able to add description, tip and clue': ({profile, level, loader}) ->
      loader.setDescription "foo"
      loader.setTip "bar"
      loader.setClue "clue"
      assert.equal(level.description, "foo")
      assert.equal(level.tip, "bar")
      assert.equal(level.clue, "clue")
    
    'should be able to set size': ({profile, level, loader}) ->
      loader.setSize(5, 3)
      assert.equal(level.floor.width, 5)
      assert.equal(level.floor.height, 3)
    
    'should be able to add stairs': ({profile, level, loader}) ->
      loader.setStairs(1, 2)
      assert.deepEqual(level.floor.stairs_location, [1,2])
    
    'should yield new unit when building': ({profile, level, loader}) ->
      loader.setUnit('base', 1, 2, 'north', -> 
        assert.equal(this.constructor.name, 'Base')
        assert.equal(this.position.at(1, 2), true)
      )
    
    'should be able to add multiple-word units': ({profile, level, loader}) ->
      assert.doesNotThrow(->
        loader.setUnit('thick_sludge', 1, 2)
      )
      
    'should build warrior from profile': ({loader}) ->
      loader.setWarrior(1, 2, ->
        assert.equal(this.constructor.name, 'Warrior')
        assert.equal(this.position.at(1, 2), true)
      )

    'should be able to set time bonus': ({loader, level})->
      loader.setTimeBonus(100)
      assert.equal(level.timeBonus, 100)
).export(module);