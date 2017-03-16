/*
博客服务端
node version 4.4.4
npm version 4.4.2
*/
var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var MongoClient = require('mongodb').MongoClient;
var blogdb = 'mongodb://localhost:27017/blog';
var ObjectId = require('mongodb').ObjectId;

var sortid = 5; //文章排序id
var user = {    //账户
  username:"nijun",
  password:"jiuhao123"
}

//插入数据
var inserData = function (db,data,callback) {
  var collection = db.collection('art');
  collection.insert(data,function (err,result) {
    if(err){
      console.log(err);
      return
    }
    callback(result);
  })
}
//查找数据
var selectData = function(db,tag,callback) {
  var collection =db.collection('art');
  if(tag==""){    //查找全部
    collection.find().sort({"sortid":-1}).toArray(function (err,result) {
      if(err) {
        console.log(err);
        return;
      }
      callback(result);
    });
  } else{ //按标签查找
      var whereStr = {"tag":tag};
      collection.find(whereStr).sort({"sortid":-1}).toArray(function (err,result) {
        if(err) {
          console.log(err);
          return;
        }
        callback(result);
      });
    }
}
//更新数据
var updataData = function(db,data,callback) {
  var collection = db.collection('art');
  var whereStr = {"_id":ObjectId(data._id)};
  var updateStr = {$set:{"title":data.title,"txt":data.txt,"tag":data.tag,"author":data.author}};
  collection.update(whereStr,updateStr,function(err,result){
    if(err){
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
  } else if(pathname == '/login') {  //响应登录
    var data = "";
    req.on("data",function(chunk){
      data += chunk;
    });
    req.on("end",function(){
      data = querystring.parse(data);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.writeHead(200,{"Content-Type":"text/plain;charset=UTF-8"});
      if(data.username == user.username && data.password == user.password) {
        res.write("success");
        res.end();
      }else{
        res.write("wrong");
        res.end();
      }
    });
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
        if(data.username == user.username && data.password == user.password){
          delete data.username;
          delete data.password;
          if(data._id){ //博文修改
            MongoClient.connect(blogdb,function (err,db){
              updataData(db,data,function (result){
                db.close();
              })
            })
          } else {  //新增博文
            data.sortid = sortid;
            sortid++;
            MongoClient.connect(blogdb,function (err,db) {
              inserData(db,data,function (result) {
                db.close();
                // res.setHeader('Access-Control-Allow-Origin', '*');
                // res.writeHead(200,{"Content-Type":"text/plain;charset=UTF-8"});
                // res.write("OK");
                // res.end();
              })
            })
          }
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.writeHead(200,{"Content-Type":"text/plain;charset=UTF-8"});
          res.write("OK");
          res.end();
        }else{
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.writeHead(200,{"Content-Type":"text/plain;charset=UTF-8"});
          res.write("用户验证出错");
          res.end();
        }
    });
  } else if(pathname == '/home') {  //更新首页文章
    MongoClient.connect(blogdb,function (err,db) {
      selectData(db,"",function (result) {
        db.close();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(200,{"Content-Type":"text/plain;charset=UTF-8"});
        res.write(JSON.stringify(result));
        res.end();
      })
    })
  } else if(pathname == '/html/css' || '/javascript' || '/other') {  //更新各个标签文章
    MongoClient.connect(blogdb,function (err,db) {
      var tag = pathname.substr(1);
      selectData(db,tag,function (result) {
        db.close();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(200,{"Content-Type":"text/plain;charset=UTF-8"});
        res.write(JSON.stringify(result));
        res.end();
      })
    })
  } else {
    res.writeHead(200,{"Content-Type":"text/plain;charset=UTF-8"});
    res.write("404 NOT FOUND");
    res.end();
  }
}).listen(3000);
