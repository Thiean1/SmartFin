const DanhMuc = require("../models/DanhMuc");

exports.getAll = async (req, res) => {
  try {
    const { userId, loai } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: "Thiếu thông tin người dùng",
      });
    }

    const whereClause = {
      ID_nguoi_dung: userId,
    };

    // Nếu có loại danh mục, thêm vào điều kiện tìm kiếm
    if (loai) {
      whereClause.Loai = loai;
    }

    const data = await DanhMuc.findAll({
      where: whereClause,
      order: [["Ten_danh_muc", "ASC"]],
    });

    if (!data || data.length === 0) {
      return res.json([]);
    }

    res.json(data);
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    res.status(500).json({
      error: "Không thể lấy danh sách danh mục",
    });
  }
};

exports.create = async (req, res) => {
  const dm = await DanhMuc.create(req.body);
  res.status(201).json(dm);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  await DanhMuc.update(req.body, { where: { ID_danh_muc: id } });
  res.json({ message: "Cập nhật thành công" });
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await DanhMuc.destroy({ where: { ID_danh_muc: id } });
  res.json({ message: "Xóa thành công" });
};
