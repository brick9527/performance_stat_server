const dgram = require('dgram');

const { udp = {} } = require('../../config');
const initContext = require('../../libs/init_context');
const loadHandler = require('./libs/load_handler');

async function main () {
  const ctx = await initContext();

  const handler = loadHandler.call(ctx);
  const server = dgram.createSocket('udp4');

  server.on('error', err => {
    console.log(`server error:\n${err.stack}`);
    server.close();
  });

  server.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    handler[msg.handler][msg.method](msg);
  });

  server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
  });

  server.bind(udp.port || 41234);
  return server;
}

if (require.main === module) {
  main();
}

module.exports = main;
