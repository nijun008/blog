
var mongoose = require('mongoose')

module.exports = new mongoose.Schema({
  //关联分类
  tag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  },
  //关联作者
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  //创建时间
  createTime: {
    type: Date,
    default: new Date()
  },
  //点击量
  views: {
    type: Number,
    default: 0
  },

  title: String,

  description: {
    type: String,
    default: ''
  },

  content: {
    type: String,
    default: ''
  },

  //评论
  comments: {
    type: Array,
    default: []
  }

})
