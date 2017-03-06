/*
博客服务端
node version 4.4.4
npm version 4.4.2
*/
var http = require('http');
var fs = require('fs');
var url = require('url');
var MongoClient = require('mongodb').MongoClient;
var blogdb = 'mongodb://localhost:27017/blog';

//插入数据
var inserData = function (db,data,callback) {
  var collection = db.collection('other');
  collection.insert(data,function (err,result) {
    if(err){
      console.log(err);
      return
    }
    callback(result);
  })
}
//查找数据
var selectData = function(db,callback) {
  var collection =db.collection('other');
  var whereStr = {"tag":"其他相关"};
  collection.find(whereStr).toArray(function (err,result) {
    if(err) {
      console.log(err);
      return;
    }
    callback(result);
  });
}

http.createServer(function (req,res) {
  var pathname = url.parse(req.url).pathname;
  if(pathname == '/'){  //响应主页
    fs.readFile('./blog-html.html','UTF-8',function (err,data) {
      if(err) throw err;
      res.writeHead(200,{'Content-Type':'text/html'});
      res.write(data);
      res.end();
    })
  } else if(pathname == '/blog-css.css') {  //响应CSS
    fs.readFile('./blog-css.css','UTF-8',function (err,data) {
      if(err) throw err;
      res.writeHead(200,{'Content-Type':'text/css'});
      res.write(data);
      res.end();
      })
  } else if(pathname == '/blog-js.js') {  //响应js
    fs.readFile('./blog-js.js','UTF-8',function (err,data) {
      if(err) throw err;
      res.writeHead(200,{'Content-Type':'application/javascript'});
      res.write(data);
      res.end();
      })
  } else if(pathname == '/sanitize.min.js') {  //响应js
    fs.readFile('./sanitize.min.js','UTF-8',function (err,data) {
      if(err) throw err;
      res.writeHead(200,{'Content-Type':'application/javascript'});
      res.write(data);
      res.end();
      })
  } else if(pathname == '/controller.js') {  //响应controller
    fs.readFile('./controller.js','UTF-8',function (err,data) {
      if(err) throw err;
      res.writeHead(200,{'Content-Type':'application/javascript'});
      res.write(data);
      res.end();
      })
  } else if(pathname == '/ediart'){ //响应博文编辑
    var data = "";
    req.on("data",function(chunk){  
        data += chunk;
    });
    req.on("end",function(){  
        data = JSON.parse(data);
        console.log(data);
        MongoClient.connect(blogdb,function (err,db) {
          inserData(db,data,function (result) {
            console.log(result);
            db.close();
            res.writeHead(200,{"Content-Type":"text/plain;charset=UTF-8"});
            res.write("OK");
            res.end();
          })
        })
    });
  } else if(pathname == '/other') {
    MongoClient.connect(blogdb,function (err,db) {
      console.log("连接成功");
      selectData(db,function (result) {
        console.log(result);
        db.close();
        res.writeHead(200,{"Content-Type":"text/plain;charset=UTF-8"});
        res.write(JSON.stringify(result));
        res.end();
      })
    })
  } else {
    res.end('404 NOT FOUND');
  }
}).listen(3000);