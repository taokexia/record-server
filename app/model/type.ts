import { Application } from 'egg';

export default (app: Application) => {
    const { STRING, INTEGER } = app.Sequelize;

    const Type = app.model.define('type', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        name: STRING(100),
        type: INTEGER,
        user_id: INTEGER
    }, {
        timestamps: false
    });

    return Type;
}
