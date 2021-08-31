import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router, middleware } = app;
  const jwtErr = middleware.jwtErr(app.config.jwt.secret);
  router.get('/', controller.home.index);
  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);
  router.get('/api/user/getUserInfo', jwtErr, controller.user.getUserInfo);
  router.post('/api/user/editUserInfo', jwtErr, controller.user.editUserInfo);
  router.post('/api/upload', controller.upload.upload);

  router.post('/api/bill/add', jwtErr, controller.bill.add);
  router.get('/api/bill/list', jwtErr, controller.bill.list);
};
