const cluster = require('cluster');
const process = require('process');

// const udpServer = require('./process/udp');
const koaServer = require('./process/koa');
const processMain = [koaServer];

if (cluster.isMaster) {
  console.log(`Primary ${process.pid} is running`);

  // 衍生工作进程。
  for (let i = 0; i < processMain.length; i++) {
    cluster.fork({ processIndex: i });
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  console.log('----------------', process.env.processIndex);
  const index = process.env.processIndex;
  processMain[index]();
}
