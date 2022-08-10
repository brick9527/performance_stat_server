const BaseSchema = require('../libs/base_schema');

const processSchema = new BaseSchema({
  // 时间戳
  timestamp: {
    type: Date,
    index: true,
    required: true,
  },

  // 批次号
  batchId: {
    type: String,
    index: true,
    required: true,
  },

  // 排名
  order: {
    type: Number,
    index: true,
    default: 1,
    required: true,
  },

  // pid
  pid: { type: String },

  // ppid
  ppid: { type: String },

  // uid
  uid: { type: String },

  // cpu
  cpu: { type: Number },

  // memory
  memory: { type: Number },

  // name
  name: { type: String },

  // cmd
  cmd: { type: String },

  // 标记
  tag: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = processSchema.createModel('Process');
