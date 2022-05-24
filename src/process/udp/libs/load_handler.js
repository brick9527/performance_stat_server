const fs = require('fs');
const path = require('path');

module.exports = function () {
  const { logger } = this;
  const handler = {};
  const handlerFolderPath = path.join(__dirname, '..', 'handler');

  const handlerFileNames = fs.readdirSync(handlerFolderPath);

  handlerFileNames.forEach(handlerFileName => {
    const originHandlerName = handlerFileName.split('.').slice(0, -1).join('.');
    const handlerName = originHandlerName.split('_').map((item, index) => {
      if (index === 0 || !item) {
        return item;
      }

      const [firstWord, ...otherWord] = item;
      return [firstWord.toUpperCase(), ...otherWord].join('');
    }).join('');

    const targetPath = path.join(handlerFolderPath, handlerFileName);
    logger.debug(`加载控制器${handlerName}: ${targetPath}`);
    handler[handlerName] = require(targetPath);
  });
};
