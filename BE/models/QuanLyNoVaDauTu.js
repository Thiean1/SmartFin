const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const QuanLyNoVaDauTu = sequelize.define(
  "QuanLyNoVaDauTu",
  {
    ID_quan_ly: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_nguoi_dung: DataTypes.INTEGER,
    Ten_khoan: DataTypes.STRING,
    So_tien: DataTypes.INTEGER,
    Loai_khoan: DataTypes.STRING,
    Lai_suat: DataTypes.FLOAT,
    Ngay_bat_dau: DataTypes.DATE,
    Ngay_ket_thuc: DataTypes.DATE,
  },
  {
    tableName: "quan_ly_no_va_dau_tu",
    timestamps: false,
  }
);

module.exports = QuanLyNoVaDauTu;
