var https = require('https');
var querystring = require('querystring');
var parseString = require('xml2js').parseString;
var express = require('express');
var app = express();

app.get('/openapi/:req_search/:req_han', function(req, res){
    var search = req.params.req_search;
	var req_han = req.params.req_han;
    var queryOption = {'query':search, 'display':1, 'start':1};
    var query = querystring.stringify(queryOption);
    var client_id = '9IZ9GopLRNGvpIDU0mQ8';
    var client_secret = 'ZqCxw8vtuo';
    var host = 'openapi.naver.com';
    var port = 443;
    var uri = '/v1/search/encyc.xml?';
	var check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    console.log(query)
	var options = {
        host: host,
        port: port,
        path: uri + query,
        method: 'GET',
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };
 req = https.request(options, function(response) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        response.setEncoding('utf8');
        response.on('data', function (xml) {
            parseString(xml, function(err, result){
                var data = JSON.stringify(result);
				console.log(data)
				data_str = String(data)
				str = data_str;
				chk_han = str.indexOf(req_han);

				if(chk_han!=-1) res.send("1")
				else res.send("0")

            });
        });
    });
    req.end();
});

app.listen(3000, function(){
  console.log('Example app listening on port 3002!');
});