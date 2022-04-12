const redis = require('redis');
const { promisify } = require('util');

const { redis: redisConfig } = require('../config');
const logger = require('./log4js').getLogger('redis');

const processName = process.env.process_name || process.pid;

/**
 * redis重连方法
 * @param {any} options - 失败参数
 * @property {any} options.error - 失败信息
 * @property {Number} options.total_retry_time - 重连持续时间
 * @property {Number} options.attempt - 重连次数
 * @return 下次重连在多少毫秒之后
 */
const retryStrategy = function (options) {
  if (options.error && options.error.code === 'ECONNREFUSED') {
    logger.error(`${processName} redis server refused the connection`);
  }

  // 检查重连时间是否超时
  if (options.total_retry_time > redisConfig.totalRetryTime) {
    logger.error(`${processName} reids retry time exhausted`);
  }

  // 检查是否超出最大重连数量
  if (options.attempt > redisConfig.attempt) {
    return undefined;
  }

  // 多少毫秒之后继续重连
  return Math.max(options.attempt * 100, redisConfig.minRetryDelay);
};

/**
 * 获取redis实例
 * @returns {Promise<any>} redisClient - redis客户端
 */
const createRedisClient = function () {
  return new Promise((resolve, reject) => {
    const connectOptions = {
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
      retry_strategy: retryStrategy,
    };

    // 创建redis客户端实例
    const redisClient = redis.createClient(connectOptions);

    redisClient.on('error', function (err) {
      logger.error(`${processName} redis error. ${err}`);
      return reject(err);
    });

    redisClient.on('connect', function () {
      // 同步化所有API
      for (const fn in Object.getPrototypeOf(redisClient)) {
        if (Object.getPrototypeOf(redisClient).fn) {
          const key = fn + 'Async';
          redisClient[key] = promisify(redisClient[fn]).bind(redisClient);
        }
      }

      logger.info(`${processName} redis connected.`);
      return resolve(redisClient);
    });

    redisClient.on('reconnecting', function (message) {
      logger.warn(
        `${processName} redis reconnecting. attempt: ${message.attempt}, total retry time: ${message.total_retry_time}, times connected: ${message.times_connected}`,
      );
    });
  });
};

module.exports = createRedisClient;
