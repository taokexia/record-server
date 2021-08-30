// This file is created by egg-ts-helper@1.26.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportJwtErr from '../../../app/middleware/jwtErr';

declare module 'egg' {
  interface IMiddleware {
    jwtErr: typeof ExportJwtErr;
  }
}
