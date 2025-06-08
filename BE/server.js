const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

const authRoutes = require("./routes/auth");
const giaoDichRoutes = require("./routes/giaodich");
const danhMucRoutes = require("./routes/danhmuc");
const mucTieuRoutes = require("./routes/muctieu");
const quanLyNoRoutes = require("./routes/quanlyno");
const tuVanAIRoutes = require("./routes/tuvanai");
const phanHoiRoutes = require("./routes/phanhoi");
const userRoutes = require("./routes/user");
const aiRoutes = require("./routes/ai");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/giaodich", giaoDichRoutes);
app.use("/api/danhmuc", danhMucRoutes);
app.use("/api/muctieu", mucTieuRoutes);
app.use("/api/quanlyno", quanLyNoRoutes);
app.use("/api/tuvanai", tuVanAIRoutes);
app.use("/api/phanhoi", phanHoiRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log("Kết nối MySQL thành công!");
    app.listen(5000, () => console.log("Server chạy ở http://localhost:5000"));
  })
  .catch((err) => {
    console.error("Không kết nối được DB:", err);
  });
