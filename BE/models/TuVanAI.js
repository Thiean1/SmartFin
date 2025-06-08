const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TuVanAI = sequelize.define(
  "TuVanAI",
  {
    ID_tu_van: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_nguoi_dung: DataTypes.INTEGER,
    ID_Admin: DataTypes.INTEGER,
    Noi_dung: DataTypes.STRING,
    Ngay_tu_van: DataTypes.DATE,
    Loai: DataTypes.STRING,
  },
  {
    tableName: "Tu_van_AI",
    timestamps: false,
  }
);

module.exports = TuVanAI;
