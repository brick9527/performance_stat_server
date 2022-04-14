const dgram = require('dgram');

function main () {
  const server = dgram.createSocket('udp4');

  server.on('error', err => {
    console.log(`server error:\n${err.stack}`);
    server.close();
  });

  server.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  });

  server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
  });

  server.bind(41234);
}

if (require.main === module) {
  main();
}

module.exports = main;
