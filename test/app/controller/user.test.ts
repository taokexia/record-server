import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';

describe('test/app/controller/user.test.ts', () => {
  it('test register user already have should return fail', async () => {
    app.mockCsrf();
    const result = await app.httpRequest()
      .post('/api/user/register')
      .type('form')
      .send({
        username: 'abc',
        password: '123456',
      })
      .expect(200)
      .expect({
        code: 500,
        msg: '账户名已被注册，请重新输入',
        data: null,
      });
    assert(result.statusCode === 200);
  });
});
