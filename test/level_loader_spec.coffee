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
      loader.description "foo"
      loader.tip "bar"
      loader.clue "clue"
      assert.equal(level.description, "foo")
      assert.equal(level.tip, "bar")
      assert.equal(level.clue, "clue")
    
    'should be able to set size': ({profile, level, loader}) ->
      loader.size(5, 3)
      assert.equal(level.floor.width, 5)
      assert.equal(level.floor.height, 3)
    
    'should be able to add stairs': ({profile, level, loader}) ->
      loader.stairs(1, 2)
      assert.deepEqual(level.floor.stairs_location, [1,2])
    
    'should yield new unit when building': ({profile, level, loader}) ->
      loader.unit('base_unit', 1, 2, 'north', -> 
        assert.equal(this.constructor.name, 'BaseUnit')
        assert.equal(this.position.at(1, 2), true)
      )
    
    'should be able to add multiple-word units': ({profile, level, loader}) ->
      assert.doesNotThrow(->
        loader.unit('thick_sludge', 1, 2)
      )
      
    'should build warrior from profile': ({loader}) ->
      loader.warrior(1, 2, 'east', ->
        assert.equal(this.constructor.name, 'Warrior')
        assert.equal(this.position.at(1, 2), true)
      )

    'should be able to set time bonus': ({loader, level})->
      loader.time_bonus(100)
      assert.equal(level.timeBonus, 100)

  'Load a Level from a file':
    'topic': ->
      profile = new JsWarrior.Profile()
      profile.towerPath = "../towers/beginner"

      level = new JsWarrior.Level(profile, 1)
      loader = new JsWarrior.LevelLoader(level)      
      profile: profile
      level: level
      loader: loader
      
    'should load a level': ({profile, level, loader}) ->
      level.loadLevel()
      assert.equal(level.timeBonus, 15)
      assert.equal(level.aceScore, 10)
      assert.equal(level.description, "You see before yourself a long hallway with stairs at the end. There is nothing in the way.")
      assert.equal(level.tip, "Call warrior.walk() to walk forward in the Player 'playTurn()' method.")
      
).export(module);