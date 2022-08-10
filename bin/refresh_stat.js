const fs = require('fs');
const path = require('path');
const readline = require('readline');

const createMongoClient = require('../src/utils/mongodb');
const { Mem, Cpu, Process } = require('../src/model');

async function _startHook () {
  console.log('开始更新数据');

  await Mem.updateMany(
    {},
    {
      $set: { tag: true },
    },
  );

  await Cpu.updateMany(
    {},
    {
      $set: { tag: true },
    },
  );
}

async function insertMemData (fileName, filePath) {
  console.log(`[mem]读取文件: ${fileName}`);

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: 'utf-8' }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const memData = JSON.parse(line);
    const entry = {
      timestamp: new Date(memData.timestamp),
      batchId: memData.batchId,
      total: memData.total,
      free: memData.free,
      freePercent: memData.freePercent,
      usedPercent: memData.usedPercent,
      tag: false,
    };

    await Mem.create(entry);
  }
}

async function insertCpuData (fileName, filePath) {
  console.log(`[cpu]读取文件: ${fileName}`);

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: 'utf-8' }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const cpuData = JSON.parse(line);
    const entry = {
      timestamp: new Date(cpuData.timestamp),
      batchId: cpuData.batchId,
      coreIndex: cpuData.coreIndex,
      usedPercent: cpuData.usedPercent,
      tag: false,
    };

    await Cpu.create(entry);
  }
}

async function insertProcessData (fileName, filePath) {
  console.log(`[process]读取文件: ${fileName}`);

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: 'utf-8' }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const processData = JSON.parse(line);

    const { list = [] } = processData;

    for (const [index, listData] of list.entries()) {
      const entry = {
        timestamp: new Date(processData.timestamp),
        batchId: processData.batchId,
        order: index + 1,
        pid: listData.pid,
        ppid: listData.ppid,
        uid: listData.uid,
        cpu: listData.cpu,
        memory: listData.memory,
        name: listData.name,
        cmd: listData.cmd,
        tag: false,
      };

      await Process.create(entry);
    }
  }
}

async function _endHook () {
  await Mem.deleteMany({ tag: true });
  await Cpu.deleteMany({ tag: true });
  await Process.deleteMany({ tag: true });
  console.log('更新数据完成');
}

async function main () {
  await createMongoClient();
  const targetFolderPath = path.join(__dirname, '..', 'stat');
  await _startHook();

  const allFiles = fs.readdirSync(targetFolderPath);
  const memFiles = allFiles.filter(fileName => fileName.startsWith('mem'));
  const cpuFiles = allFiles.filter(fileName => fileName.startsWith('cpu'));
  const processFiles = allFiles.filter(fileName => fileName.startsWith('process'));
  // 读取内存的数据
  for (let i = 0; i < memFiles.length; i++) {
    const fileName = memFiles[i];
    const targetFilePath = path.join(targetFolderPath, fileName);
    await insertMemData(fileName, targetFilePath);
  }

  // 读取CPU的数据
  for (let i = 0; i < cpuFiles.length; i++) {
    const fileName = cpuFiles[i];
    const targetFilePath = path.join(targetFolderPath, fileName);
    await insertCpuData(fileName, targetFilePath);
  }

  // 读取process的数据
  for (const processFileName of processFiles) {
    const targetFilePath = path.join(targetFolderPath, processFileName);
    await insertProcessData(processFileName, targetFilePath);
  }

  await _endHook();
}

if (require.main === module) {
  main().then(() => {
    process.exit();
  });
}

module.exports = main;
