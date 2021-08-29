/*
 * @Author: taokexia
 * @Date: 2021-08-29 23:03:16
 * @LastEditTime: 2021-08-30 00:29:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \record-servercd\app\controller\user.ts
 */
import { Controller } from 'egg';

// 默认头像，放在 user.js 的最外，部避免重复声明。
const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png'

export default class UserController extends Controller {
  public async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    if (!username || !password) {
        ctx.body = {
            code: 500,
            msg: '账号密码不能为空',
            data: null
        };
        return;
    }

    const userInfo = await ctx.service.user.getUserByName(username);
    // 判断是否已经存在
    if (userInfo && userInfo.getDataValue('id')) {
        ctx.body = {
            code: 500,
            msg: '账户名已被注册，请重新输入',
            data: null
        };
        return;
    }

    const result  = await ctx.service.user.register({
        username,
        password: ctx.service.user.encode(password),
        signature: '世界和平。',
        avatar: defaultAvatar
    });

    if (result) {
        ctx.body = {
            code: 200,
            msg: '注册成功',
            data: null
        };
    } else {
        ctx.body = {
            code: 500,
            msg: '注册失败',
            data: null,
        };
    }
  }
}
