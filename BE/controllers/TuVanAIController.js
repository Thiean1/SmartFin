const TuVanAI = require("../models/TuVanAI");

exports.getAll = async (req, res) => {
  const { userId } = req.query;
  const data = await TuVanAI.findAll({ where: { ID_nguoi_dung: userId } });
  res.json(data);
};

exports.create = async (req, res) => {
  const item = await TuVanAI.create(req.body);
  res.status(201).json(item);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  await TuVanAI.update(req.body, { where: { ID_tu_van: id } });
  res.json({ message: "Cập nhật thành công" });
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await TuVanAI.destroy({ where: { ID_tu_van: id } });
  res.json({ message: "Xóa thành công" });
};
