const QuanLyNoVaDauTu = require("../models/QuanLyNoVaDauTu");

exports.getAll = async (req, res) => {
  try {
    const { userId } = req.query;
    const data = await QuanLyNoVaDauTu.findAll({
      where: { ID_nguoi_dung: userId },
    });
    res.json(data);
  } catch (err) {
    console.error("Lỗi lấy dữ liệu quan_ly_no_va_dau_tu:", err);
    res.status(500).json({ error: "Không thể lấy dữ liệu" });
  }
};

exports.create = async (req, res) => {
  const item = await QuanLyNoVaDauTu.create(req.body);
  res.status(201).json(item);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  await QuanLyNoVaDauTu.update(req.body, { where: { ID_quan_ly: id } });
  res.json({ message: "Cập nhật thành công" });
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await QuanLyNoVaDauTu.destroy({ where: { ID_quan_ly: id } });
  res.json({ message: "Xóa thành công" });
};
