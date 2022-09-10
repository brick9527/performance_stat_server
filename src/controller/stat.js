const dayjs = require('dayjs');

module.exports = {
  // 获取内存数据
  async getMem (ctx) {
    const { Mem } = ctx.model;
    const { date = new Date() } = ctx.query;

    const startTime = dayjs(date || new Date()).startOf('day').toDate();
    const endTime = dayjs(date || new Date()).endOf('day').toDate();

    const list = await Mem.find({
      timestamp: {
        $gte: startTime,
        $lte: endTime,
      },
    }, { __v: 0, _id: 0 })
      .sort({ timestamp: 1 })
      .lean();
    const result = list.map(item => {
      item.timestamp = dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss');
      return item;
    });
    ctx.body = { list: result };
  },

  // 获取CPU数据
  async getCpu (ctx) {
    const { Cpu } = ctx.model;
    const { date = new Date() } = ctx.query;

    const startTime = dayjs(date || new Date()).startOf('day').toDate();
    const endTime = dayjs(date || new Date()).endOf('day').toDate();

    const list = await Cpu.find({
      timestamp: {
        $gte: startTime,
        $lte: endTime,
      },
    }, { __v: 0, _id: 0 })
      .sort({ timestamp: 1 })
      .lean();

    const result = list.map(item => {
      item.timestamp = dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss');
      return item;
    });
    ctx.body = { list: result };
  },

  // 获取对应批次的进程信息
  async getProcess (ctx) {
    const { Process } = ctx.model;
    const { batchId } = ctx.query;

    const processList = await Process.find({ batchId })
      .sort({ order: 1 })
      .lean();

    ctx.body = { list: processList };
  },
};
