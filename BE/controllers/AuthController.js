const NguoiDung = require("../models/NguoiDung");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await NguoiDung.findOne({ where: { Email: email } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng!" });
    }
    const isMatch = await bcrypt.compare(password, user.Mat_khau);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng!" });
    }
    const { Mat_khau, ...userData } = user.toJSON();
    res.json({ user: userData });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

exports.register = async (req, res) => {
  const { ho_va_ten, email, password, ngay_sinh, thu_nhap_hang_thang } =
    req.body;
  try {
    const existing = await NguoiDung.findOne({ where: { Email: email } });
    if (existing) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await NguoiDung.create({
      Ho_va_ten: ho_va_ten,
      Email: email,
      Mat_khau: hash,
      Ngay_sinh: ngay_sinh,
      Thu_nhap_hang_thang: thu_nhap_hang_thang,
      Ngay_tao_tai_khoan: new Date(),
    });
    const { Mat_khau, ...userData } = user.toJSON();
    res.status(201).json({ user: userData });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
