import { Application } from 'egg';

export type UserType = {
  id?: number;
  username: string;
  password: string;
  signature: string;
  avatar: string;
  ctime?: Date;
};

export default (app: Application) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    username: STRING(100),
    password: STRING(100),
    signature: STRING(100),
    avatar: STRING(100),
    ctime: DATE,
  }, {
    timestamps: false,
  });

  return User;
};
