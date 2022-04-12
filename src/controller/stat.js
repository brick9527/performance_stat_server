const dayjs = require('dayjs');

module.exports = {
  // 获取内存数据
  async getMem (ctx) {
    const { Mem } = ctx.model;
    const { date } = ctx.query;

    const startTime = dayjs(date).startOf('day').toDate();
    const endTime = dayjs(date).endOf('day').toDate();

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
    const { date } = ctx.query;

    const startTime = dayjs(date).startOf('day').toDate();
    const endTime = dayjs(date).endOf('day').toDate();

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
};
