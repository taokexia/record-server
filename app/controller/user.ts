/*
 * @Author: taokexia
 * @Date: 2021-08-29 23:03:16
 * @LastEditTime: 2021-08-31 22:31:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \record-servercd\app\controller\user.ts
 */
import { Controller } from 'egg';
import { tokenType } from '../service/User';

// 默认头像，放在 user.js 的最外，部避免重复声明。
const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png';


export default class UserController extends Controller {
  // 注册
  public async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: '账号密码不能为空',
        data: null,
      };
      return;
    }

    const userInfo = await ctx.service.user.getUserByName(username);
    // 判断是否已经存在
    if (userInfo && userInfo.getDataValue('id')) {
      ctx.body = {
        code: 500,
        msg: '账户名已被注册，请重新输入',
        data: null,
      };
      return;
    }

    const result = await ctx.service.user.register({
      username,
      password: ctx.service.user.encode(password),
      signature: '世界和平。',
      avatar: defaultAvatar,
    });

    if (result) {
      ctx.body = {
        code: 200,
        msg: '注册成功',
        data: null,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: '注册失败',
        data: null,
      };
    }
  }

  // 登录
  public async login() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    // 根据用户名，在数据库查找相对应的id操作
    const userInfo = await ctx.service.user.getUserByName(username);
    if (!userInfo || !userInfo.getDataValue('id')) {
      ctx.body = {
        code: 500,
        msg: '账号或密码错误,请重试！',
        data: null,
      };
      return;
    }
    // 找到用户，并且判断输入密码与数据库中用户密码。
    const encodePwd = ctx.service.user.encode(password);
    if (userInfo && encodePwd !== userInfo.getDataValue('password')) {
      ctx.body = {
        code: 500,
        msg: '账号或密码错误,请重试！',
        data: null,
      };
      return;
    }
    // 生成 token 加盐
    // app.jwt.sign 方法接受两个参数，第一个为对象，对象内是需要加密的内容；第二个是加密字符串
    const token = app.jwt.sign({
      id: userInfo.getDataValue('id'),
      username: userInfo.getDataValue('username'),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // token 有效期为 24 小时
    } as tokenType, app.config.jwt.secret);

    ctx.body = {
      code: 200,
      message: '登录成功',
      data: {
        token,
      },
    };
  }

  // 获取用户信息
  async getUserInfo() {
    const { ctx } = this;
    // 通过 app.jwt.verify 方法，解析出 token 内的用户信息
    const decode = ctx.decode as tokenType;
    // 通过 getUserByName 方法，以用户名 decode.username 为参数，从数据库获取到该用户名下的相关信息
    const userInfo = await ctx.service.user.getUserByName(decode.username);
    // userInfo 中应该有密码信息，所以我们指定下面四项返回给客户端
    ctx.body = {
      code: 200,
      msg: '请求成功',
      data: {
        id: userInfo?.getDataValue('id'),
        username: userInfo?.getDataValue('username'),
        signature: userInfo?.getDataValue('signature') || '',
        avatar: userInfo?.getDataValue('avatar') || defaultAvatar
      }
    };
  }

  // 修改用户信息
  async editUserInfo() {
    const { ctx } = this;
    const { signature = '', avatar = '' } = ctx.request.body;

    // 通过 app.jwt.verify 方法，解析出 token 内的用户信息
    const decode = ctx.decode as tokenType;
    if (!decode) return;
    // 通过 username 查找 userInfo 完整信息
    const userInfo = await ctx.service.user.getUserByName(decode.username);
    // 通过 service 方法 editUserInfo 修改 signature 信息。
    const result = await ctx.service.user.editUserInfo({
      id: userInfo?.getDataValue('id'),
      signature: signature || userInfo?.getDataValue('signature'),
      avatar: avatar || userInfo?.getDataValue('avatar')
    });
    if (result) {
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          signature,
          username: decode.username,
          avatar: avatar || userInfo?.getDataValue('avatar')
        }
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '请求失败',
        data: result
      }
    }
  }
}
