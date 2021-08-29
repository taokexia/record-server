import { Application } from 'egg';

export default (app: Application) => {
    const { STRING, INTEGER, DATE } = app.Sequelize;

    const Bill = app.model.define('bill', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        pay_type: INTEGER,
        amount: STRING(100),
        date: DATE,
        type_id: INTEGER,
        type_name: STRING(100),
        user_id: INTEGER,
        remark: STRING(100)
    }, {
        timestamps: false
    });

    return Bill;
}
