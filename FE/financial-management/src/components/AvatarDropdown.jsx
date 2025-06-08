import React, { useState } from "react";
import axios from "axios";

export default function AvatarDropdown({ user, onLogout, children }) {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editUser, setEditUser] = useState({ ...user });
  const [loading, setLoading] = useState(false);

  // Khi mở modal, đồng bộ lại thông tin user
  React.useEffect(() => {
    if (open) setEditUser({ ...user });
  }, [open, user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Chuẩn hóa dữ liệu gửi lên backend
      const payload = {
        Ho_va_ten: editUser.name || editUser.Ho_va_ten || "",
        Email: editUser.email || editUser.Email || "",
        Ngay_sinh: editUser.ngay_sinh || "",
        Thu_nhap_hang_thang: editUser.thu_nhap_hang_thang || "",
        // Nếu có thêm trường khác, bổ sung ở đây
      };
      await axios.put(`http://localhost:5000/api/user/${user.ID_nguoi_dung}`, payload);
      // Cập nhật localStorage
      const newUser = { ...user, ...payload };
      localStorage.setItem("user", JSON.stringify(newUser));
      setEditMode(false);
      window.location.reload();
    } catch (err) {
      alert("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div onClick={() => setOpen(true)} style={{ cursor: "pointer", width: "100%" }}>
        {children}
      </div>
      {open && (
        <div>
          {/* Overlay */}
          <div
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.25)",
              zIndex: 1000
            }}
            onClick={() => { setOpen(false); setEditMode(false); }}
          />
          {/* Modal */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              minWidth: 320,
              zIndex: 1001,
              padding: 32,
              textAlign: "center"
            }}
          >
            {!editMode ? (
              <>
                <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>
                  {user?.Ho_va_ten || user?.name || user?.username || "Người dùng"}
                </div>
                <div style={{ color: "#666", fontSize: 15, marginBottom: 8 }}>
                  <b>Email:</b> {user?.Email || user?.email || "Chưa cập nhật"}
                </div>
                <div style={{ color: "#666", fontSize: 15, marginBottom: 8 }}>
                  <b>Giới tính:</b> {user?.gioi_tinh || user?.gender || "Chưa cập nhật"}
                </div>
                <div style={{ color: "#666", fontSize: 15, marginBottom: 8 }}>
                  <b>Ngày sinh:</b> {user?.Ngay_sinh || user?.ngay_sinh || "Chưa cập nhật"}
                </div>
                <div style={{ color: "#666", fontSize: 15, marginBottom: 20 }}>
                  <b>Thu nhập hàng tháng:</b> {user?.Thu_nhap_hang_thang || user?.thu_nhap_hang_thang ? Number(user.Thu_nhap_hang_thang || user.thu_nhap_hang_thang).toLocaleString('vi-VN') + ' đ' : "Chưa cập nhật"}
                </div>
                <button
                  onClick={() => setEditMode(true)}
                  style={{
                    background: "#1976d2", color: "#fff", border: "none", borderRadius: 4,
                    padding: "8px 20px", cursor: "pointer", fontWeight: 500, fontSize: 15, marginRight: 10
                  }}
                >
                  Sửa thông tin
                </button>
                <button
                  onClick={onLogout}
                  style={{
                    background: "#dc3545", color: "#fff", border: "none", borderRadius: 4,
                    padding: "8px 20px", cursor: "pointer", fontWeight: 500, fontSize: 15
                  }}
                >
                  Đăng xuất
                </button>
                <div>
                  <button
                    onClick={() => { setOpen(false); setEditMode(false); }}
                    style={{
                      marginTop: 16,
                      background: "#f1f1f1",
                      color: "#333",
                      border: "none",
                      borderRadius: 4,
                      padding: "8px 20px",
                      cursor: "pointer"
                    }}
                  >
                    Đóng
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Sửa thông tin cá nhân</div>
                <div style={{ marginBottom: 12 }}>
                  <input
                    type="text"
                    value={editUser.Ho_va_ten || editUser.name || editUser.username || ""}
                    onChange={e => setEditUser({ ...editUser, Ho_va_ten: e.target.value })}
                    placeholder="Tên người dùng"
                    style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc", marginBottom: 8 }}
                  />
                  <input
                    type="email"
                    value={editUser.Email || editUser.email || ""}
                    onChange={e => setEditUser({ ...editUser, Email: e.target.value })}
                    placeholder="Email"
                    style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc", marginBottom: 8 }}
                  />
                  <select
                    value={editUser.gioi_tinh || editUser.gender || ""}
                    onChange={e => setEditUser({ ...editUser, gioi_tinh: e.target.value })}
                    style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc", marginBottom: 8 }}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                  <input
                    type="date"
                    value={editUser.Ngay_sinh || editUser.ngay_sinh || ""}
                    onChange={e => setEditUser({ ...editUser, Ngay_sinh: e.target.value })}
                    placeholder="Ngày sinh"
                    style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc", marginBottom: 8 }}
                  />
                  <input
                    type="number"
                    value={editUser.Thu_nhap_hang_thang || editUser.thu_nhap_hang_thang || ""}
                    onChange={e => setEditUser({ ...editUser, Thu_nhap_hang_thang: e.target.value })}
                    placeholder="Thu nhập hàng tháng"
                    min={0}
                    style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  style={{
                    background: "#1976d2", color: "#fff", border: "none", borderRadius: 4,
                    padding: "8px 20px", cursor: loading ? "not-allowed" : "pointer", fontWeight: 500, fontSize: 15, marginRight: 10,
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? "Đang lưu..." : "Lưu"}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  disabled={loading}
                  style={{
                    background: "#f1f1f1",
                    color: "#333",
                    border: "none",
                    borderRadius: 4,
                    padding: "8px 20px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: 500, fontSize: 15,
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  Hủy
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 