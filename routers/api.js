var express = require('express')
var User = require('../models/User')
var Tag = require('../models/Tag')
var Content = require('../models/Content')
var Comment = require('../models/Comment')

var router = express.Router()

//统一返回数据
var responseData
router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: ''
  }
  next()
})

//获取所有标签
router.get('/tags',function (req, res, next) {
  responseData = {
    userInfo: req.userInfo,
  }
  Tag.find().then(tags => {
    responseData.code = 200
    responseData.message = 'SUCCESS'
    responseData.tags = tags
    res.json(responseData)
    return
  })
})

//获取文章列表
router.get('/contents', function (req, res, next) {

  responseData.contents = []
  responseData.count = 0
  responseData.page = Number(req.query.page) || 1
  responseData.limit = 5
  responseData.pages = 0
  responseData.tag = req.query.tag || null

  var where = {}
  if (responseData.tag) {
    where.tag = responseData.tag
  }
  Content.where(where).count().then(count => {
    responseData.count = count
    responseData.pages = Math.ceil(responseData.count / responseData.limit)
    responseData.page = Math.min(responseData.page, responseData.pages)
    responseData.page = Math.max(responseData.page, 1)
    var skip = (responseData.page - 1) * responseData.limit
    return Content.where(where).find().sort({ createTime: -1}).limit(responseData.limit).skip(skip).populate(['tag', 'user'])
  }).then((contents) => {
    responseData.contents = contents
    res.json(responseData)
    return
  })
})

//获取文章详情
router.get('/content', function (req, res) {
  var id = req.query.id || ''
  Content.findOne({
    _id: id
  }).populate(['tag', 'user']).then(content => {
    responseData.content = content

    content.views ++ //文章阅读数累加
    content.save()

    return Comment.where({ content: id }).find().sort({ createTime: -1 }).populate('user')
  }).then(comments => {
    responseData.message = 'success'
    responseData.comments = comments
    res.json(responseData)
    return
  })
})

//用户注册
router.post('/user/register', function (req, res, next) {
  var username = req.body.username
  var password = req.body.password
  var confirmPassword = req.body.confirmPassword

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
  if(password !== confirmPassword) {
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
      return Promise.reject('用户名已被占用')
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
  }).catch(err=> {
    return
  })

})

//用户登录
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
      username: userInfo.username,
      isAdmin: userInfo.isAdmin
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
  
  new Comment({
    content: req.body.contentId,
    user: req.userInfo._id.toString(),
    txt: req.body.txt,
    createTime: new Date()
  }).save().then((newContent) => {
    responseData.code = 200
    responseData.message = 'success'
    res.json(responseData)
    return
  })

})

module.exports = router