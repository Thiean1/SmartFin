const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const GiaoDich = sequelize.define(
  "GiaoDich",
  {
    ID_giao_dich: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_nguoi_dung: DataTypes.INTEGER,
    ID_danh_muc: DataTypes.INTEGER,
    So_tien: DataTypes.INTEGER,
    Ngay_giao_dich: DataTypes.DATE,
    Ghi_chu: DataTypes.STRING,
    Loai: DataTypes.STRING,
  },
  {
    tableName: "Giao_dich",
    timestamps: false,
  }
);

module.exports = GiaoDich;
