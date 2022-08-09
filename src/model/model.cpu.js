const BaseSchema = require('../libs/base_schema');

const cpuSchema = new BaseSchema({
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

  // 核数
  coreIndex: {
    type: Number,
    required: true,
    index: true,
  },

  // 使用率
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

module.exports = cpuSchema.createModel('Cpu');
