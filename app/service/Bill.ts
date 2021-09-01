import { Service } from 'egg';
import { BillEditType, BillType } from '../model/bill';

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

  public async list(id, date, type_id) {
    const { app } = this;
    const { Op } = app.Sequelize;

    const searchDate = new Date(date);
    const startDate = new Date(searchDate.getFullYear(), searchDate.getMonth(), 1);
    const endDate = new Date(searchDate.getFullYear(), searchDate.getMonth()+1, 1);
    const where: any = {
      user_id: id,
      date: {
        [Op.lt]: endDate,
        [Op.gt]: startDate
      },
    }
    if (type_id !== 'all') where.type_id = type_id;
    try {
      const result = await app.model.Bill.findAll({
        where,
        attributes: ['id', 'pay_type', 'amount', 'date', 'type_name']
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async listCount(id) {
    const { app } = this;
    try {
      const result = await app.model.Bill.count({
        where: {
          user_id: id
        }
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 查看细节
  public async detail(id) {
    const { app } = this;
    try {
      const result = app.model.Bill.findOne({
        where: {
          id
        }
      });
      return result;
    } catch (error) {
      return null;
    }
  }
  // 更新细节
  public async update(params: BillEditType) {
    const { app } = this;
    try {
      const result = app.model.Bill.update({
        ...params
      }, {
        where: {
          id: params.id,
          user_id: params.user_id
        }
      });
      return result;
    } catch (error) {
      return null;
    }
  }

  // 删除
  public async delete(id, user_id) {
    const { app } = this;
    try {
      const result = app.model.Bill.destroy({
        where: {
          id,
          user_id
        }
      });
      return result;
    } catch (error) {
      return null;
    }
  }
}
