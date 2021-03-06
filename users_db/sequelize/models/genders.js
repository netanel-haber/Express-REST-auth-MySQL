/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('genders', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(1),
      allowNull: false
    },
    desc: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'genders'
  });
};
