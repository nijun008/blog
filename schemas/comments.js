
var mongoose = require('mongoose')

module.exports = new mongoose.Schema({
  //关联文章
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  },
  //关联评论用户
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  createTime: {
    type: Date,
    default: new Date()
  },

  txt: String,

})