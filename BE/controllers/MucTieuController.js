const MucTieu = require("../models/MucTieu");

exports.getAll = async (req, res) => {
  const { userId } = req.query;
  const data = await MucTieu.findAll({ where: { ID_nguoi_dung: userId } });
  res.json(data);
};

exports.create = async (req, res) => {
  const mt = await MucTieu.create(req.body);
  res.status(201).json(mt);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  await MucTieu.update(req.body, { where: { ID_muc_tieu: id } });
  res.json({ message: "Cập nhật thành công" });
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await MucTieu.destroy({ where: { ID_muc_tieu: id } });
  res.json({ message: "Xóa thành công" });
};
