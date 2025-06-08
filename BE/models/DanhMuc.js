const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DanhMuc = sequelize.define(
  "DanhMuc",
  {
    ID_danh_muc: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_nguoi_dung: DataTypes.INTEGER,
    Ten_danh_muc: DataTypes.STRING,
    Loai: DataTypes.STRING,
  },
  {
    tableName: "Danh_muc",
    timestamps: false,
  }
);

module.exports = DanhMuc;
