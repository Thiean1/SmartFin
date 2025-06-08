const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PhanHoi = sequelize.define(
  "PhanHoi",
  {
    ID_phan_hoi: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_nguoi_dung: DataTypes.INTEGER,
    Noi_dung: DataTypes.STRING,
    Ngay_gui: DataTypes.DATE,
    Trang_thai: DataTypes.STRING,
  },
  {
    tableName: "Phan_hoi",
    timestamps: false,
  }
);

module.exports = PhanHoi;
