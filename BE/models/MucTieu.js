const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const MucTieu = sequelize.define(
  "MucTieu",
  {
    ID_muc_tieu: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_nguoi_dung: DataTypes.INTEGER,
    ID_danh_muc: DataTypes.INTEGER,
    Ten_muc_tieu: DataTypes.STRING,
    So_tien_muc_tieu: DataTypes.INTEGER,
    So_tien_da_dat: DataTypes.INTEGER,
    Han_hoan_thanh: DataTypes.DATE,
  },
  {
    tableName: "Muc_tieu",
    timestamps: false,
  }
);

module.exports = MucTieu;
