const fs = require('fs');
const path = require('path');
const readline = require('readline');

const createMongoClient = require('../src/utils/mongodb');
const { Mem, Cpu } = require('../src/model');

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

  for await (const lint of rl) {
    const linePart = lint.split(', ');
    const entry = {
      timestamp: new Date(linePart[0]),
      total: Number(linePart[1]),
      free: Number(linePart[2]),
      freePercent: Number(linePart[3]),
      usedPercent: Number(linePart[4]),
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

  for await (const lint of rl) {
    const linePart = lint.split(', ');
    const entry = {
      timestamp: new Date(linePart[0]),
      coreIndex: Number(linePart[1]),
      usedPercent: Number(linePart[2]),
      tag: false,
    };

    await Cpu.create(entry);
  }
}

async function _endHook () {
  await Mem.deleteMany({ tag: true });
  await Cpu.deleteMany({ tag: true });
  console.log('更新数据完成');
}

async function main () {
  await createMongoClient();
  const targetFolderPath = path.join(__dirname, '..', 'stat');
  await _startHook();

  const allFiles = fs.readdirSync(targetFolderPath);
  const memFiles = allFiles.filter(fileName => fileName.startsWith('mem'));
  const cpuFiles = allFiles.filter(fileName => fileName.startsWith('cpu'));
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

  await _endHook();
}

if (require.main === module) {
  main().then(() => {
    process.exit();
  });
}

module.exports = main;
