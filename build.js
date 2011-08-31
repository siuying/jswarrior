var stitch  = require('stitch');
var fs      = require('fs');
var coffee  = require('coffee-script');

var package = stitch.createPackage({
  paths: [
    __dirname + '/vendor',
    __dirname + '/lib',
    __dirname + '/towers',
  ]
});

package.compile(function (err, source){
  fs.writeFile('output/js_warrior.js', source, function (err) {
    if (err) throw err;
    console.log('Compiled output/js_warrior.js');
  })
})