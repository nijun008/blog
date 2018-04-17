var express = require('express')
var multer = require('multer')
var fs = require('fs')

var router = express.Router()

var dir = './public/upload/'
var upload = multer({ dest: dir })

router.post('/', upload.any(), function(req, res, next) {

  //console.log(req.files[0])  // 上传的文件信息
  let _path = dir + req.files[0].filename

  fs.readFile( req.files[0].path, function (err, data) {
    fs.rename(_path, _path + '.jpg', function (err) {
      if ( err ) {
        console.log( err )
      } else {
        responseData = {
          code: 200,
          message: '图片上传成功',
          filename: req.files[0].filename + '.jpg',
          url: '/public/upload/' + req.files[0].filename + '.jpg'
        };
        res.json(responseData)
        return
      }
    })
  })
})

module.exports = router