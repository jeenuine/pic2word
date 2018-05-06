var pwd = '/home/ubuntu/myapp/base_photo/';
var split = require('string-split');
var undot = split('.');
var express = require('express');
var multer = require('multer');

var _storage = multer.diskStorage({
  destination: function (req, file, cb) { //파일 저장 위치 설정
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) { // 파일 저장 이름 설정
    cb(null, file.originalname)
  }
});

var spawn = require('child_process').spawn
var upload = multer({ storage: _storage })
var router = express.Router();
var fs = require('fs');
const sqliteJson = require('sqlite-json'); 
const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('/home/ubuntu/myapp/data/data.db');
var mkdirp = require('mkdirp');
const exporter = sqliteJson(db);
require('date-utils');
const translate = require('google-translate-api');
var https = require('https');
var querystring = require('querystring');
var parseString = require('xml2js').parseString;


router.get('/upload',function(req,res){
	res.render('upload');
	console.log('Get upload');
});
router.post('/upload',upload.single('userfile'),function(req,res){ //spawn 사용
	console.log(req.file);
    console.log('file save');
	console.log(undot(req.file.filename)[0])
	var result = '';
	var label = '';
	var db_result = '';
	var output;
	var py = spawn('python3',['/home/ubuntu/inception/predict.py','/home/ubuntu/myapp/'+req.file.destination+req.file.filename])
	console.log("inception predict")
	py.stdout.on('data', function(data){
		console.log('stdout: ' + data);
		result = JSON.parse(data);
		label = result.max_label;
		exporter.json('select ID,cate_ID from label where name ="'+label+'"',function(err,db_data){
			if(err) console.log(err);
			db_result = JSON.parse(db_data)
			db_result = db_result[0]
			output = Object.assign(result,db_result);
			console.log(output)
			res.send(output)
		})
	})
	py.on('exit', function(code) {
		console.log('child process exited with code ' + code);
	})
})

router.post('/train_req',upload.single('userfile'),function(req,res){
	console.log(req.file);
	console.log('train request');
	var dt = new Date();
	var d = dt.toFormat('DD_HH24_MI_SS')
	var name = undot(req.file.filename)[0]
	var split_name = name.split('_')
	console.log(split_name[0])
	console.log(split_name[1])
	var korea = split_name[1]
	
	translate(korea,{from:'ko', to:'en'}).then(res_trans=>{
		label = String(res_trans.text).toLowerCase()
		console.log(label);
		exporter.json('select ID,cate_ID,name from label where name ="'+label+'"',function(err_1,db_data){
			db_result = JSON.parse(db_data);
			db_result = db_result[0]
			console.log(db_data)
			console.log(db_result)
			if(db_result){
				console.log("select_1 : ",db_result)
				res.send(db_result);
			}
			else{
				exporter.json('select ID from category where name ="'+split_name[0]+'"',function(err_2,cate_res){
					if(err_2){
					console.log("err_2")
					console.error(err_2)
					}
					cate_res = JSON.parse(cate_res)
					cate_res = cate_res[0]
					cate_res = cate_res.ID
					console.log("select_2 : ",cate_res)
					
					exporter.json('insert into label (cate_ID,name) values ("'+cate_res+'","'+label+'")',function(err_3,insert_res){
						if(err_3) {
							console.log("err_3")
							console.error(err_3)
						}
						
						console.log('insert label table : '+label);
						exporter.json('select ID,cate_ID,name from label where name ="'+label+'"',function(err_4,last_data){
							if(err_4) console.log(err_4);
				            last_db_result = JSON.parse(last_data)
                        	last_db_result = last_db_result[0]
							console.log("select_3 : ",last_db_result)
                        	res.send(last_db_result)
                		});
						
					});
					
					
				});
				mkdirp('/home/ubuntu/inception/workspace/photos/'+split_name[0]+'_'+label,function(err_5){
					if (err_5) console.error(err_5)
					else console.log('make directory');
				});
				fs.rename('/home/ubuntu/myapp/'+req.file.path,'/home/ubuntu/inception/workspace/photos/'+split_name[0]+'_'+label+'/'+d+'.jpg');
				console.log('success');
			}
		});
	}).catch(err=>{
		console.error(err);
		console.log('fail')
	});
});

router.get('/down_base',function(req,res){
	console.log('18 request');
	var file = fs.createReadStream(pwd+'base.zip',{flags:'r'});
	file.pipe(res);
});




module.exports = router;
