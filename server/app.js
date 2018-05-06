var express = require('express');
var app = express();
app.use(express.static('public'));
app.set('view engine','jade');
app.set('views','./views');

var user = require('./routes/user.js');
app.use('/user',user);
var inception = require('./routes/inception.js');
app.use('/inception',inception);


app.get('/',function(res,req){
	res.send('alpago');
});

app.listen(3002, function(){
  console.log('Example app listening on port 3002!');
});

module.exports = app;
