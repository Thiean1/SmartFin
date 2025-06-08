const GiaoDich = require("../models/GiaoDich");

exports.getAll = async (req, res) => {
  const { userId } = req.query;
  const data = await GiaoDich.findAll({ where: { ID_nguoi_dung: userId } });
  res.json(data);
};

exports.create = async (req, res) => {
  const gd = await GiaoDich.create(req.body);
  res.status(201).json(gd);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  await GiaoDich.update(req.body, { where: { ID_giao_dich: id } });
  res.json({ message: "Cập nhật thành công" });
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await GiaoDich.destroy({ where: { ID_giao_dich: id } });
  res.json({ message: "Xóa thành công" });
};
