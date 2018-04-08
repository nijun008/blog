var express = require('express')
var Tag = require('../models/Tag')
var Content = require('../models/Content')

var router  = express.Router()

var data

//页面公共数据
router.use(function (req, res, next) {
  data = {
    userInfo: req.userInfo,
    tags: [],
  }
  Tag.find().then(tags => {
    data.tags = tags
    next()
  })
})


router.get('/', function (req, res, next) {

  data.contents = []
  data.count = 0
  data.page = Number(req.query.page) || 1
  data.limit = 10
  data.pages = 0
  data.tag = req.query.tag || null

  var where = {}
  if (data.tag) {
    where.tag = data.tag
  }
  Content.where(where).count().then(count => {
    data.count = count
    data.pages = Math.ceil(data.count / data.limit)
    data.page = Math.min(data.page, data.pages)
    data.page = Math.max(data.page, 1)
    var skip = (data.page - 1) * data.limit
    return Content.where(where).find().sort({ createTime: -1}).limit(data.limit).skip(skip).populate(['tag', 'user'])
  }).then((contents) => {
    data.contents = contents
    res.render('main/index', data)
  })
})

router.get('/view', function (req, res) {
  var id = req.query.contentid || ''
  Content.findOne({
    _id: id
  }).populate(['tag', 'user']).then(content => {
    data.content = content

    content.views ++ //文章阅读数累加
    content.save()

    res.render('main/view', data)
  })
})

module.exports = router