  const theConfig = config;
  const configTemp = config.url;
  if (theConfig.method === 'post') {
    // let deviceId = localStorage.getItem('deviceId');
    // if (!deviceId || deviceId.length !== 8) {
    //   deviceId = utils.randomString(8);
    //   localStorage.setItem('deviceId', deviceId);
    // }
    // // theConfig.headers.deviceId = deviceId;


    const noAuthArry = []; // 不需要登录的path '/api',
    const needAuthArry = []; // 需要登录的path

    if ((noAuthArry.every((x) => configTemp.indexOf(x) === -1) && sessionStorage.getItem('token')) || (needAuthArry.some((x) => configTemp.indexOf(x) !== -1) && sessionStorage.getItem('token'))) {
      // eslint-disable-next-line
      if (!global.config.isProEnv) {
        // eslint-disable-next-line no-console
        console.log(`距离上一次请求：${(moment().valueOf() - sessionStorage.getItem('t')) / 1000}秒`);
      }
      if (sessionStorage.getItem('t') && (moment().valueOf() - sessionStorage.getItem('t')) > 2 * 3600 * 1000) { // 如果token两小时过期
        // message.error('登录过期，请先登录');
        router.push({
          path: '/',
        });
        sessionStorage.clear();
      } else {
        theConfig.headers.Authorization = sessionStorage.getItem('token');
      }
    }
  }
