import { Service } from 'egg';
import { BillType } from '../model/bill';

/**
 * Bill Service
 */
export default class Bill extends Service {

  public async add(params: BillType) {
      const { app } = this;
      try {
          const result = await app.model.Bill.create(params);
          return result;
      } catch (error) {
          console.log(error);
          return null;
      } 
  }
}
