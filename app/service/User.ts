import { Service } from 'egg';
import { UserEditType, UserType } from '../model/user';
import { createHash } from 'crypto';
/**
 * User Service
 */
export default class User extends Service {

  public async getUserByName(username: string) {
    const { app } = this;
    try {
      const result = await app.model.User.findOne({
        where: {
          username,
        },
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async editUserInfo(userInfo: UserEditType) {
    const { app } = this;
    try {
      const result = await app.model.User.update({
        ...userInfo
      }, {
        where: {
          id: userInfo.id
        }
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async register(params: UserType) {
    const { app } = this;
    try {
      const result = await app.model.User.create(params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 加密密码
  public encode(password: string) {
    return createHash('md5').update(password).digest('hex');
  }
}
