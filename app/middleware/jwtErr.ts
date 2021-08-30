import { Context } from 'egg';

export default function JwtErrMiddleware(secret: string) {
  return async function jwtErr(ctx: Context, next: () => Promise<any>) {
    const token = ctx.request.header.authorization; // 若是没有 token，返回的是 null 字符串
    if (token !== 'null' && typeof token === 'string') {
      try {
        const decode = ctx.app.jwt.verify(token, secret); // 验证 token
        ctx.decode = decode;
        await next();
      } catch (error) {
        console.log('error', error)
        ctx.status = 200;
        ctx.body = {
          msg: 'token已过期，请重新登录',
          code: 401,
        }
        return;
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 401,
        msg: 'token不存在',
      };
      return;
    }
  }
}