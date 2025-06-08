const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const NguoiDung = sequelize.define(
  "NguoiDung",
  {
    ID_nguoi_dung: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Ho_va_ten: DataTypes.STRING,
    Email: DataTypes.STRING,
    Mat_khau: DataTypes.STRING,
    Ngay_sinh: DataTypes.DATE,
    Thu_nhap_hang_thang: DataTypes.INTEGER,
    Ngay_tao_tai_khoan: DataTypes.DATE,
  },
  {
    tableName: "Nguoi_dung",
    timestamps: false,
  }
);

module.exports = NguoiDung;
