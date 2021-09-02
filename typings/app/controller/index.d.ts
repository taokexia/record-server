// This file is created by egg-ts-helper@1.26.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBill from '../../../app/controller/bill';
import ExportHome from '../../../app/controller/home';
import ExportType from '../../../app/controller/type';
import ExportUpload from '../../../app/controller/upload';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    bill: ExportBill;
    home: ExportHome;
    type: ExportType;
    upload: ExportUpload;
    user: ExportUser;
  }
}
