import { Controller } from 'egg';
import { tokenType } from '../service/User';

export default class TypeController extends Controller {

  public async list() {
    const { ctx } = this;
    try {
      // 通过 app.jwt.verify 方法，解析出 token 内的用户信息
      const decode = ctx.decode as tokenType;
      if (!decode) return;
      const result = await ctx.service.type.list();
      if (result) {
        ctx.body = {
          code: 200,
          msg: '请求成功',
          data: result,
        };
      } else {
        ctx.body = {
          code: 500,
          msg: '请求失败',
          data: result,
        };
      }
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }
}
