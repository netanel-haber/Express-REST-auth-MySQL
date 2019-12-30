/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('info', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    hash: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    gender_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'genders',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'info'
  });
};
