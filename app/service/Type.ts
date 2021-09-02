import { Service } from 'egg';

/**
 * Type Service
 */
export default class Type extends Service {
  // get list
  public async list() {
    const { app } = this;
    try {
      const result = await app.model.Type.findAll();
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
