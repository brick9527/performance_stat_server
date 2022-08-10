const BaseSchema = require('../libs/base_schema');

const memSchema = new BaseSchema({
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

  // 总共内存
  total: {
    type: Number,
    required: true,
  },

  // 空闲内存
  free: {
    type: Number,
    required: true,
  },

  // 空闲比例
  freePercent: {
    type: Number,
    required: true,
  },

  // 已使用比例
  usedPercent: {
    type: Number,
    required: true,
  },

  // 标记
  tag: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = memSchema.createModel('Mem');
