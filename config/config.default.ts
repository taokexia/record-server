import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import * as path from 'path';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1630231730090_3889';

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    sequelize: {
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'record',
      timezone: '+08:00',
    },
    jwt: {
      secret: 'Bob',
    },
    multipart: {
      mode: 'file',
    },
    uploadDir: 'public/upload',
    security: {
      domainWhiteList: [ 'http://localhost:3000' ],
    },
    // cors
    cors: {
      // origin: 'http://localhost:3000',
      credentials: true,
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    },
    // static
    static: {
      prefix: '',
      dir: path.join(appInfo.baseDir, 'public'),
    },
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
