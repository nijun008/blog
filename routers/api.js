var express = require('express')
var router  = express.Router()
var User = require('../models/User')
var Content = require('../models/Content')

//统一返回数据
var responseData
router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: ''
  }
  next()
})

router.get('/', function (req, res, next) {
  res.send('api')
})

//用户注册
router.post('/user/register', function (req, res, next) {
  var username = req.body.username
  var password = req.body.password
  var repassword = req.body.repassword

  //简单验证
  if(username == '') {
    responseData.code = 1
    responseData.message = '用户名为空'
    res.json(responseData)
    return
  }
  if(password == '') {
    responseData.code = 2
    responseData.message = '密码不能为空'
    res.json(responseData)
    return
  }
  if(password !== repassword) {
    responseData.code = 3
    responseData.message = '两次输入的密码不一致'
    res.json(responseData)
    return
  }

  //用户名重名验证
  User.findOne({
    username: username
  }).then(function (userInfo) {
    if(userInfo) {
      responseData.code = 4
      responseData.message = '用户名已被占用'
      res.json(responseData)
      return
    }
    var user = new User({
      username: username,
      password: password
    })
    return user.save()
  }).then(function (newUserInfo) {
    responseData.code = 200
    responseData.message = '注册成功'
    res.json(responseData)
  })

})

router.post('/user/login', function (req, res, next) {
  var username = req.body.username
  var password = req.body.password
  if(username == '' || password == '') {
    responseData.code = 1
    responseData.message = '用户名和密码不能为空'
    res.json(responseData)
    return
  }

  User.findOne({
    username: username,
    password: password
  }).then(function (userInfo) {
    if(!userInfo) {
      responseData.code = 2;
      responseData.message = '用户名或密码错误'
      res.json(responseData)
      return
    }
    responseData.code = 200
    responseData.message = '登录成功'
    responseData.userInfo = {
      _id: userInfo._id,
      username: userInfo.username
    }
    req.cookies.set('userInfo', JSON.stringify({
      _id: userInfo._id,
      username: userInfo.username
    }))
    res.json(responseData)
    return
  })
})

router.get('/user/logout', function (req, res, next) {
  req.cookies.set('userInfo', null)
  responseData.code = 200
  responseData.message = '退出成功'
  res.json(responseData)
  return
})

//评论提交接口
router.post('/comment/post', function (req, res) {
  //评论文章ID
  var contentId = req.body.contentId || ''
  //评论数据
  var postData = {
    username: req.userInfo.username,
    createTime: new Date(),
    content: req.body.content,
  }

  //保存评论到数据库
  Content.findOne({
    _id: contentId
  }).then(content => {
    content.comments.push(postData)
    return content.save()
  }).then((newContent) => {
    responseData.code = 200
    responseData.message = '评论提交成功'
    res.json(responseData)
    return
  })
})

module.exports = router