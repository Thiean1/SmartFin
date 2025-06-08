const NguoiDung = require("../models/NguoiDung");

exports.update = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    await NguoiDung.update(data, { where: { ID_nguoi_dung: id } });
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ error: "Cập nhật thất bại" });
  }
};
