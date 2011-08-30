exports.JsWarrior = 
  version: '0.0.1'
  Floor: require('./js_warrior/floor').Floor
  Game: require('./js_warrior/game').Game
  Level: require('./js_warrior/level').Level
  Position: require('./js_warrior/position').Position
  Space: require('./js_warrior/space').Space
  Abilities: require('./js_warrior/abilities').Abilities
  Units: 
    Base: require('./js_warrior/units/base').Base
    Golem: require('./js_warrior/units/golem').Golem
    Warrior: require('./js_warrior/units/warrior').Warrior
    Sludge: require('./js_warrior/units/sludge').Sludge