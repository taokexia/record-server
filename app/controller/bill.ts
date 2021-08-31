import { Controller } from 'egg';
import { tokenType } from '../service/User';

export default class BillController extends Controller {
  public async add() {
    const { ctx } = this;
    // 获取请求中携带的参数
    const { amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
    // 判空处理，这里前端也可以做，但是后端也需要做一层判断。
    if (!amount || !type_id || !type_name || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null
      }
    }
    try {
      // 通过 app.jwt.verify 方法，解析出 token 内的用户信息
      const decode = ctx.decode as tokenType;
      if (!decode) return;
      const user_id = Number(decode.id);
      // user_id 默认添加到每个账单项，作为后续获取指定用户账单的标示。
      // 可以理解为，我登录 A 账户，那么所做的操作都得加上 A 账户的 id，后续获取的时候，就过滤出 A 账户 id 的账单信息。
      const result = await ctx.service.bill.add({
        user_id,
        amount,
        type_id,
        type_name,
        date: date && !!Number(date) ? new Date(Number(date)).toISOString() : new Date(Date.now()).toISOString(),
        pay_type,
        remark
      });

      if (result) {
        ctx.body = {
          code: 200,
          msg: '请求成功',
          data: result
        };
      } else {
        ctx.body = {
          code: 500,
          msg: '请求失败',
          data: result
        };
      }
    } catch(error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null
      }
    }
  }
}
