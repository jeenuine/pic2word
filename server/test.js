require('date-utils')
var split = require('string-split');
var mkdirp = require('mkdirp');
var fs = require('fs')
mkdirp('/home/ubuntu/inception/workspace/photos/animal_dog', function(err){
	if(err) console.error(err);
	else console.log('pow!');
});
var name = 'e2582515-8b2f-4b66-a7d9-7c58861f14b3544668458.jpg';
//fs.rename('./uploads/'+name,'/home/ubuntu/'+name);
var dt = new Date();
var d = dt.toFormat('DD_HH24_MI_SS');
var undot = split('.');
console.log(d)
console.log(undot(name)[0]);
