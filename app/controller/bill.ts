import { Controller } from 'egg';
import { BillType } from '../model/bill';
import { tokenType } from '../service/User';
const moment = require('moment');

type listType = {
  date: string;
  bills: Array<BillType>;
}

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

  public async list() {
    const { ctx } = this;
    // 获取，日期 date，分页数据，类型 type_id，这些都是我们在前端传给后端的数据
    const { date = Date.now(), page = 1, page_size = 5, type_id = 'all' } = ctx.query;

    try {
      // 通过 app.jwt.verify 方法，解析出 token 内的用户信息
      const decode = ctx.decode as tokenType;
      if (!decode) return;
      const user_id = Number(decode.id);
      // 拿到当前用户的账单列表
      const list = await ctx.service.bill.list(user_id, date, type_id);
      if (list) {
        const listMap = list.reduce((curr, itemModel) => {
          // curr 默认初始值是一个空数组 []
          const item = itemModel.toJSON() as BillType;
          // 把第一个账单项的时间格式化为 YYYY-MM-DD
          const date = moment(item.date).format('YYYY-MM-DD');
          // 如果能在累加的数组中找到当前项日期 date，那么在数组中的加入当前项到 bills 数组。
          if (curr && curr.length && curr.findIndex(currItem => currItem.date == date) > -1) {
            const index = curr.findIndex(item => item.date == date);
            curr[index].bills.push(item);
          }
          // 如果在累加的数组中找不到当前项日期的，那么再新建一项。
          if (curr && curr.length && curr.findIndex(currItem => currItem.date == date) == -1) {
            curr.push({
              date,
              bills: [item]
            })
          }
          // 如果 curr 为空数组，则默认添加第一个账单项 item ，格式化为下列模式
          if (!curr.length) {
            curr.push({
              date,
              bills: [item]
            })
          }
          return curr;
        }, [] as Array<listType>).sort((a, b) => moment(b.date) - moment(a.date)); // 时间顺序为倒叙，时间约新的，在越上面

        // 分页处理，listMap 为我们格式化后的全部数据，还未分页。
        const startNum = (Number(page) - 1) * Number(page_size);
        const endNum = Number(page) * Number(page_size);
        const filterListMap = listMap.slice(startNum, endNum);

        // 累加计算支出
        const totalExpense = list.reduce((curr, item) => {
          if (item.getDataValue('pay_type') == 1) {
            curr += Number(item.getDataValue('amount')) || 0;
            return curr;
          }
          return curr;
        }, 0);
        // 累加计算收入
        let totalIncome = list.reduce((curr, item) => {
          if (item.getDataValue('pay_type') == 2) {
            curr += Number(item.getDataValue('amount')) || 0;
            return curr;
          }
          return curr;
        }, 0);
        // 返回数据
        ctx.body = {
          code: 200,
          msg: '请求成功',
          data: {
            totalExpense, // 当月支出
            totalIncome, // 当月收入
            totalPage: Math.ceil(listMap.length / Number(page_size)), // 总分页
            list: filterListMap || [] // 格式化后，并且经过分页处理的数据
          }
        }
      } else {
        ctx.body = {
          code: 500,
          msg: '未查询到数据',
          data: null
        }
      }
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null
      }
    }
  }
}
