const PhanHoi = require("../models/PhanHoi");

exports.getAll = async (req, res) => {
  const { userId } = req.query;
  const data = await PhanHoi.findAll({ where: { ID_nguoi_dung: userId } });
  res.json(data);
};

exports.create = async (req, res) => {
  const item = await PhanHoi.create(req.body);
  res.status(201).json(item);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  await PhanHoi.update(req.body, { where: { ID_phan_hoi: id } });
  res.json({ message: "Cập nhật thành công" });
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await PhanHoi.destroy({ where: { ID_phan_hoi: id } });
  res.json({ message: "Xóa thành công" });
};
