const sqliteJson = require('sqlite-json'); 
const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('/home/ubuntu/myapp/data/user_data.db');
const exporter = sqliteJson(db);
var express = require('express');
var rn = require('random-number');
var rn_option = { min :1, max : 13,integer:true};
var sortByProperty = function (property) {

    return function (x, y) {

        return ((x[property] === y[property]) ? 0 : ((x[property] < y[property]) ? 1 : -1));

    };

};

var router = express.Router();
require('date-utils');
router.get('/allUser',function(req,res){
	exporter.json('select * from user',function(err,db_data){
		db_result = JSON.parse(db_data);
		console.log('Get all User');
		res.send(db_result);
	});
});

router.get('/getUser/:user_id', function(req,res){
	var user = req.params.user_id
	exporter.json('select * from user where user_id = "'+user+'"',function(err,db_data){
		db_result = JSON.parse(db_data)
		db_result = db_result[0]
		console.log("getUser : " +user);
		console.log(db_result);
		res.send(db_result);
	});
});

router.post('/addUser/:user_id',function(req,res){
	var user = req.params.user_id;
	var stc = 0;
	exporter.json('select ID from user where user_id = "'+user+'"',function(err,db_data){
		db_result = JSON.parse(db_data)
		if (!db_result[0]) {stc =1;}
		console.log(stc);
		if( stc == 1)
		{
			exporter.json('insert into user (user_id) values ("'+user+'")',function(err,db_data){
				console.log('insert user table :'+user);
				res.send('success');
			});
		}
		else 
		{
			console.log('insert user failure');
			res.send('-1');
		}
	});

});

router.delete('/deleteUser/:user_id', function(req, res){
	var user = req.params.user_id;
	exporter.json('delete from user where user_id = "'+user+'"',function(err,db_data){
		if (err == null)
		{
			console.log('delete user : '+user);
			res.send('delete user success');
		}
		else
		{
			console.log(err);
			console.log('delete failure');
			res.send('-1');
		}
	});
});



router.get('/getRanking',function(req,res){
	exporter.json('select * from user',function(err,db_data){
		db_result = JSON.parse(db_data);
		db_result.sort(sortByProperty('acc_point'));
		console.log('Get point ranking');
		res.send(db_result);
	});
});

router.get('/getMission/:user_id',function(req,res){
	var user = req.params.user_id;
	var dt = new Date();
	var d = dt.toFormat('DD')
	var arr = new Array();
	var num_str = '';
	exporter.json('select date from user where user_id ="'+user+'"',function(err,db_data){
		db_result = JSON.parse(db_data);
		db_data = db_result[0]["date"];
		console.log(db_data);
		console.log(d);
		if(db_data != d){
			exporter.json('update user set date ='+d+' where user_id ="'+user+'"',function(err,db_data){
				console.log(user+"date update : "+d);
			});
			for(var i =0; i < 5; i++){
				arr.push(rn(rn_option));
				console.log(arr)
				arr2 = new Set(arr)
				console.log(arr2)
				if(arr2.size < i+1) i--; 
			}
			arr = Array.from(arr2);
			exporter.json('select * from mission where ID in('+String(arr)+')',function(err,data){
				console.log(data)
				console.log(user+"mission");
				db_result = JSON.parse(data);
				res.send(db_result);
			});
		}
		else {
			res.send('-1');
		}
	});
	

});

module.exports = router;
