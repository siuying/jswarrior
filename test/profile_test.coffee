vows = require('vows')
assert = require('assert')

{_} = require('underscore')
{JsWarrior} = require('../lib/js_warrior')

vows.describe('Profile').addBatch(
  'Profile': 
    'topic': ->
      new JsWarrior.Profile()

    'should calculate average grade': (profile) ->
      profile.currentEpicScore = 123
      profile.currentEpicGrades = 1: 1.0, 2: 1.0
      grade = profile.calculateAverageGrade()
      assert.equal(grade, 1.0)

      profile.currentEpicGrades = 1: 1.0, 2: 0.9
      grade = profile.calculateAverageGrade()
      assert.equal(grade, 0.95)
    
    'should add abilities while keeping unique': (profile) ->
      beforeCount = profile.abilities.length
      profile.addAbilities('attack')
      afterCount = profile.abilities.length
      assert.equal(afterCount - beforeCount, 1)
      
      profile.addAbilities('attack')
      afterCount = profile.abilities.length
      assert.equal(afterCount - beforeCount, 1)

      profile.addAbilities('attack')      
      afterCount = profile.abilities.length
      assert.equal(afterCount - beforeCount, 1)
      
      
).export(module);