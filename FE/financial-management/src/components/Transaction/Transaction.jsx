import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Transaction.scss";



export default function Transaction() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.ID_nguoi_dung;
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    ID_danh_muc: "",
    So_tien: "",
    Ngay_giao_dich: "",
    Ghi_chu: "",
    Loai: "Chi tiêu",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!userId) return;
      setIsLoadingCategories(true);
      setError("");
      try {
        console.log("Fetching categories for:", { userId, loai: form.Loai });
        const res = await axios.get(`http://localhost:5000/api/danhmuc?userId=${userId}&loai=${form.Loai}`);
        console.log("Categories response:", res.data);
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Không thể tải danh mục. Vui lòng thử lại sau.");
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [userId, form.Loai]);
  
  console.log({
    ID_nguoi_dung: userId,
    ID_danh_muc: Number(form.ID_danh_muc),
    So_tien: Number(form.So_tien),
    Ngay_giao_dich: form.Ngay_giao_dich,
    Ghi_chu: form.Ghi_chu,
    Loai: form.Loai,
  });
  // Lấy danh sách giao dịch
  const fetchGiaoDich = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/giaodich?userId=${userId}`);
      setTransactions(res.data);
    } catch (err) {
      setError("Không thể tải danh sách giao dịch");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGiaoDich();
    // eslint-disable-next-line
  }, [userId]);

  // Thêm giao dịch
  const handleAdd = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      if (editingId) {
        // Cập nhật giao dịch
        await axios.put(`http://localhost:5000/api/giaodich/${editingId}`, {
          ID_nguoi_dung: userId,
          ID_danh_muc: Number(form.ID_danh_muc),
          So_tien: Number(form.So_tien),
          Ngay_giao_dich: form.Ngay_giao_dich,
          Ghi_chu: form.Ghi_chu,
          Loai: form.Loai,
        });
        setEditingId(null);
      } else {
        // Thêm giao dịch mới
        await axios.post("http://localhost:5000/api/giaodich", {
          ID_nguoi_dung: userId,
          ID_danh_muc: Number(form.ID_danh_muc),
          So_tien: Number(form.So_tien),
          Ngay_giao_dich: form.Ngay_giao_dich,
          Ghi_chu: form.Ghi_chu,
          Loai: form.Loai,
        });
      }
      resetForm();
      fetchGiaoDich();
    } catch (err) {
      setError(editingId ? "Không thể cập nhật giao dịch" : "Không thể thêm giao dịch");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      ID_danh_muc: "",
      So_tien: "",
      Ngay_giao_dich: "",
      Ghi_chu: "",
      Loai: "Chi tiêu",
    });
    setEditingId(null);
  };

  // Xóa giao dịch
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) return;
    
    setIsLoading(true);
    setError("");
    try {
      await axios.delete(`http://localhost:5000/api/giaodich/${id}`);
      fetchGiaoDich();
    } catch (err) {
      setError("Không thể xóa giao dịch");
    } finally {
      setIsLoading(false);
    }
  };

  // Sửa giao dịch
  const handleEdit = (transaction) => {
    setForm({
      ID_danh_muc: transaction.ID_danh_muc,
      So_tien: transaction.So_tien,
      Ngay_giao_dich: transaction.Ngay_giao_dich?.slice(0, 10),
      Ghi_chu: transaction.Ghi_chu,
      Loai: transaction.Loai,
    });
    setEditingId(transaction.ID_giao_dich);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="transaction-page">
      <div className="transaction-form-card">
        <div className="transaction-form-title">
          {editingId ? "Sửa giao dịch" : "Thêm giao dịch mới"}
        </div>
        <div className="transaction-form-desc">
          {editingId ? "Cập nhật thông tin giao dịch" : "Ghi lại thu nhập hoặc chi tiêu của bạn"}
        </div>
        <form className="transaction-form" onSubmit={handleAdd}>
          <div className="transaction-form-row">
            <div className="transaction-form-group">
              <label>Loại giao dịch</label>
              <select value={form.Loai} onChange={e => setForm({ ...form, Loai: e.target.value })}>
                <option>Chi tiêu</option>
                <option>Thu nhập</option>
              </select>
            </div>
            <div className="transaction-form-group">
              <label>Số tiền</label>
              <input type="number" value={form.So_tien} min={0} onChange={e => setForm({ ...form, So_tien: e.target.value })} />
            </div>
          </div>
          <div className="transaction-form-row">
            <div className="transaction-form-group">
              <label>Danh mục</label>
              <select 
                value={form.ID_danh_muc} 
                onChange={e => setForm({ ...form, ID_danh_muc: e.target.value })}
                disabled={isLoadingCategories}
                required
              >
                <option value="">Chọn danh mục</option>
                {isLoadingCategories ? (
                  <option disabled>Đang tải danh mục...</option>
                ) : categories.length === 0 ? (
                  <option disabled>Không có danh mục</option>
                ) : (
                  categories.map(category => (
                    <option key={category.ID_danh_muc} value={category.ID_danh_muc}>
                      {category.Ten_danh_muc}
                    </option>
                  ))
                )}
              </select>
              {error && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{error}</div>}
            </div>
            <div className="transaction-form-group">
              <label>Ngày</label>
              <input type="date" value={form.Ngay_giao_dich} onChange={e => setForm({ ...form, Ngay_giao_dich: e.target.value })} />
            </div>
          </div>
          <div className="transaction-form-group">
            <label>Mô tả</label>
            <input type="text" value={form.Ghi_chu} placeholder="Mô tả giao dịch..." onChange={e => setForm({ ...form, Ghi_chu: e.target.value })} />
          </div>
          <div className="transaction-form-actions">
            <button className="transaction-form-submit" type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm giao dịch"}
            </button>
            {editingId && (
              <button 
                type="button" 
                className="transaction-form-cancel"
                onClick={resetForm}
                disabled={isLoading}
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="transaction-history-card">
        <div className="transaction-form-title">Lịch sử giao dịch</div>
        <div className="transaction-form-desc">Danh sách các giao dịch đã nhập</div>
        {isLoading ? (
          <div className="transaction-loading">Đang tải...</div>
        ) : transactions.length === 0 ? (
          <div className="transaction-empty">Chưa có giao dịch nào</div>
        ) : (
          <div className="transaction-table-container">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Loại</th>
                  <th>Danh mục</th>
                  <th>Số tiền</th>
                  <th>Mô tả</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tran => (
                  <tr key={tran.ID_giao_dich} className={tran.Loai === "Thu nhập" ? "income-row" : "expense-row"}>
                    <td>{new Date(tran.Ngay_giao_dich).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <span className={`transaction-type ${tran.Loai === "Thu nhập" ? "income" : "expense"}`}>
                        {tran.Loai}
                      </span>
                    </td>
                    <td>{categories.find(c => c.ID_danh_muc === tran.ID_danh_muc)?.Ten_danh_muc || tran.ID_danh_muc}</td>
                    <td className={tran.Loai === "Thu nhập" ? "income-amount" : "expense-amount"}>
                      {tran.So_tien?.toLocaleString('vi-VN')} đ
                    </td>
                    <td>{tran.Ghi_chu}</td>
                    <td>
                      <div className="transaction-actions">
                        <button 
                          className="transaction-edit-btn"
                          onClick={() => handleEdit(tran)}
                          title="Sửa giao dịch"
                        >
                          Sửa
                        </button>
                        <button 
                          className="transaction-delete-btn"
                          onClick={() => handleDelete(tran.ID_giao_dich)}
                          title="Xóa giao dịch"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 