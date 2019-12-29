/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info', {
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
      field: 'username'
    },
    salt: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'salt'
    },
    hash: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'hash'
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'last_name'
    },
    age: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'age'
    },
    genderId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'genders',
        key: 'id'
      },
      field: 'gender_id'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'createdAt'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updatedAt'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deletedAt'
    }
  }, {
    tableName: 'info'
  });
};
