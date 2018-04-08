var express = require('express')
var User = require('../models/User')
var Tag = require('../models/Tag')
var Content = require('../models/Content')

var router  = express.Router()

//路由拦截,身份验证
router.use( function (req, res, next) {
  if(!req.userInfo.isAdmin) {
    //res.send('没有管理员权限')
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '没有管理员权限',
      url: '/'
    })
    return
  }
  next()
})

router.get('/', function (req, res, next) {
  res.render('admin/index', {
    userInfo: req.userInfo
  })
})

router.get('/user', function (req, res, next) {
  //读取数据库User列表
  //limit(number)方法限制获取的数据条数
  //skip(number)方法忽略数据的条数

  var page = Number(req.query.page) || 1
  var limit = 10
  var pages = 0

  User.count().then((count) => {

    pages = Math.ceil(count / limit)
    page = Math.min(page, pages)
    page = Math.max(page, 1)
    var skip = (page -1) * limit

    User.find().limit(limit).skip(skip).then((users) => {
       res.render('admin/user', {
        userInfo: req.userInfo,
        users: users,
        page: page,
        count: count,
        pages: pages,
        limit: limit
      })
    })
  })
})

router.get('/tag', function (req, res, next) {
  var page = Number(req.query.page) || 1
  var limit = 10
  var pages = 0

  Tag.count().then((count) => {

    pages = Math.ceil(count / limit)
    page = Math.min(page, pages)
    page = Math.max(page, 1)
    var skip = (page - 1) * limit

    Tag.find().limit(limit).skip(skip).then((tags) => {
      res.render('admin/tag', {
        userInfo: req.userInfo,
        tags: tags,
        page: page,
        count: count,
        pages: pages,
        limit: limit
      })
    })
  })
})

router.get('/tag/add', function (req, res, next) {
  res.render('admin/tag_add', {
    userInfo: req.userInfo
  })
})

router.post('/tag/add', function (req, res, next) {
  var name = req.body.name

  if(name == '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '名称不能为空'
    })
    return
  }
  //检查数据库是否存在同名标签
  Tag.findOne({
    name: name
  }).then((result) => {
    if(result) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '标签已存在'
      })
      return
    } else {
      return new Tag({
        name: name
      }).save()
      .then((newTag) => {
        res.render('admin/success', {
          userInfo: req.userInfo,
          message: '标签添加成功',
          url: '/admin/tag'
        })
      })
    }
  })

})

router.get('/tag/edit', function (req, res) {
  var id = req.query.id || '';
  Tag.findOne({
    _id: id
  }).then((tag) => {
    if(!tag) {
      res.render('admin/error',{
        userInfo: req.userInfo,
        message: '标签不存在'
      })
    } else {
      res.render('admin/tag_edit', {
        userInfo: req.userInfo,
        tag: tag
      })
    }
  })
})

router.post('/tag/edit', function (req, res) {
  var id = req.query.id
  var name = req.body.name
  Tag.findOne({
    _id: id
  }).then((tag) => {
    if(!tag) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '标签不存在'
      })
      return Promise.reject()
    } else {
      if(name == tag.name) {
        res.render('admin/success', {
          userInfo: req.userInfo,
          message: '修改成功',
          url: '/admin/tag'
        })
        return Promise.reject()
      } else {
        return Tag.findOne({
          _id: {$ne: id},
          name: name
        })
        return Promise.reject()
      }
    }
  }).then((sameTag) => {
      if(sameTag) {
        res.render('admin/error', {
          userInfo: req.userInfo,
          message: '标签已存在'
        })
        return Promise.reject()
      } else {
        return Tag.update({
          _id: id
        }, {
          name: name 
        })
      }
    }).then(() => {
      res.render('admin/success', {
        userInfo: req.userInfo,
        message: '标签修改成功',
        url: '/admin/tag'
      })
    })
})

router.get('/tag/delete', function (req, res) {
  var id = req.query.id || ''
  Tag.findOne({
    _id: id
  }).then((tag) => {
    if(!tag) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '标签不存在',
        url: '/admin/tag'
      })
      return
    } else {
      Tag.remove({
        _id: id
      }).then((result) => {
        res.render('admin/success', {
          userInfo: req.userInfo,
          message: '标签删除成功',
          url: '/admin/tag'
        })
        return
      })
    }
  }).catch(err => {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '标签不存在',
      url: '/admin/tag'
    })
    return
  })
})

//文章路由
router.get('/content', function (req, res) {

  var page = Number(req.query.page) || 1
  var limit = 10
  var pages = 0

  Content.count().then(count => {
    pages = Math.ceil(count / limit)
    page = Math.min(page, pages)
    page = Math.max(page, 1)
    var skip = (page - 1) * limit

    Content.find().sort({ _id: -1}).limit(limit).skip(skip).populate(['tag', 'user']).then(contents => {
      res.render('admin/content', {
        userInfo: req.userInfos,
        contents: contents,
        pages: pages,
        page: page,
        limit: limit,
        count: count
      })
    })

  })
})

router.get('/content/add', function (req, res) {
  Tag.find().then(tags => {
    res.render('admin/content_add', {
      userInfo: req.userInfos,
      tags: tags
    })
  })
})

router.post('/content/add', function (req, res) {

  if(req.body.tag == '' || req.body.title == '') {
    render('admin/error', {
      userInfo: req.userInfo,
      message: '文章标签和标题不能为空'
    })
    return
  }

  new Content({
    tag: req.body.tag,
    title: req.body.title,
    user: req.userInfo._id.toString(),
    description: req.body.description,
    content: req.body.content
  }).save().then(() => {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '文章保存成功',
      url: '/admin/content'
    })
  })
})

router.get('/content/edit', function (req, res) {
  var id = req.query.id || ''
  var tags = []
  Tag.find().then(result => {
    tags = result
    return Content.findOne({
      _id: id
    }).populate('tag')
  }).then(content => {
    if(!content) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '文章不存在'
      })
    } else {
      res.render('admin/content_edit', {
        userInfo: req.userInfo,
        content: content,
        tags: tags
      })
    }

  }).catch(err => {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '文章不存在'
    })
  })
})

router.post('/content/edit', function (req, res) {
  var id = req.query.id || ''
  Content.findOne({
    _id: id
  }).then(content => {
    if(!content) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '文章不存在',
        url: '/admin/content'
      })
    } else {
      if(req.body.tag == '' || req.body.title == '') {
        render('admin/error', {
          userInfo: req.userInfo,
          message: '文章标签和标题不能为空'
        })
        return
      }

      return Content.update({
        _id: id
      }, {
        tag: req.body.tag,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
      })
    }
  }).then(() => {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '保存成功',
      url: '/admin/content'
    })
  }).catch(err => {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '文章不存在'
    })
  })
})

router.get('/content/delete', function (req, res) {
  var id = req.query.id
  Content.findOne({
    _id: id
  }).then(content => {
    return Content.remove({
      _id: id
    })
  }).then(() => {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '文章删除成功',
      url: '/admin/content'
    })
  }).catch(err => {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '文章不存在',
      url: '/admin/content'
    })
  })
})

module.exports = router