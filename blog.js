/*
博客服务端
node version 4.4.4
npm version 4.4.2
*/
var http = require('http');
var fs = require('fs');
var url = require('url');

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
  } else {
    res.end('404 NOT FOUND');
  }
}).listen(3000);