const stat = require('../controller/stat');

module.exports = (router, base) => {
  router.get(
    `/api/${base}/mem`,
    stat.getMem,
  );

  router.get(
    `/api/${base}/cpu`,
    stat.getCpu,
  );
};
