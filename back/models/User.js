const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Users",
    {
      name: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.INTEGER,
      },
      image: {
        type: DataTypes.STRING,
      },
      token: {
        type: DataTypes.STRING,
      },
      tokenExp: {
        type: DataTypes.INTEGER,
      },
      publishedDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      }
    }
  )
}