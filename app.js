//加载express
var express = require('express')
//加载数据库模块
var mongoose = require('mongoose')
//加载swig模板引擎
var swig = require('swig')
//加载post数据处理中间件
var bodyParser = require('body-parser')
//加载cookies模块
var Cookies = require('cookies')
//引入User模型表
var User = require('./models/User')

var app = express()

//静态文件托管
app.use('/public', express.static(__dirname + '/public'))

//配置模板引擎,第一个参数为模板文件后缀，第二个参数为处理模板的方法
app.engine('html', swig.renderFile)

//设置模板引擎,第一个参数必须为views，第二个参数为模板文件路径
app.set('views', './views')

//设置模板引擎,第一个参数必须为view engine,第二个参数为模板文件后缀(app.engine的第一个参数)
app.set('view engine', 'html')

//开发环境取消模板引擎缓存
swig.setDefaults({ cache: false })

//设置post数据解析
app.use(bodyParser.urlencoded({ extended: true }))

//设置cookies
app.use(function (req, res, next) {
  req.cookies = new Cookies(req, res)
  req.userInfo = {}
  if(req.cookies.get('userInfo')) {
    try {
      req.userInfo = JSON.parse(req.cookies.get('userInfo'))
      //获取登录用户类型，判断是否管理员
      User.findById(req.userInfo._id).then(function (userInfo) {
        req.userInfo.isAdmin = Boolean(userInfo.isAdmin)
        next()
      })
    } catch(e) {
      next()
    }
  } else {
    next()
  }
})

//根据功能划分路由模块
app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))
app.use('/', require('./routers/main'))

//建立数据库连接
mongoose.connect('mongodb://localhost:27017/blog', function (err) {
  if(err) {
    console.log('数据库连接失败')
  } else {
    console.log('数据库已连接')
    app.listen(8080);
  }
})
