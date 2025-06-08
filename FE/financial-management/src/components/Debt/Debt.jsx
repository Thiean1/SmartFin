import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import "./Debt.scss";

export default function Debt() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.ID_nguoi_dung;
  const [debts, setDebts] = useState([]);
  const [form, setForm] = useState({ 
    Ten_khoan: "", 
    Loai_khoan: "", 
    So_tien: 0, 
    Lai_suat: 0, 
    Ngay_bat_dau: "", 
    Ngay_ket_thuc: "" 
  });

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:5000/api/quanlyno?userId=${userId}`).then(res => {
      setDebts(res.data);
    });
  }, [userId]);

  const totalDebt = debts.reduce((sum, d) => sum + d.So_tien, 0);
  const totalMinPay = debts.reduce((sum, d) => sum + (d.So_tien * d.Lai_suat / 100 / 12), 0);
  const avgInterest = debts.length ? debts.reduce((sum, d) => sum + d.Lai_suat, 0) / debts.length : 0;

  const stats = [
    { 
      title: "Tổng nợ", 
      value: totalDebt.toLocaleString("vi-VN") + " đ", 
      color: "red" 
    },
    { 
      title: "Trả tối thiểu/tháng", 
      value: totalMinPay.toLocaleString("vi-VN") + " đ", 
      color: "orange" 
    },
    { 
      title: "Lãi suất TB", 
      value: avgInterest.toFixed(1) + "%", 
      color: "yellow" 
    },
  ];

  const handleAddDebt = async (e) => {
    e.preventDefault();
    if (!form.Ten_khoan.trim() || !form.Loai_khoan || !form.So_tien) return;
    
    try {
      const response = await axios.post("http://localhost:5000/api/quanlyno", {
        ...form,
        ID_nguoi_dung: userId
      });
      setDebts([...debts, response.data]);
      setForm({ 
        Ten_khoan: "", 
        Loai_khoan: "", 
        So_tien: 0, 
        Lai_suat: 0, 
        Ngay_bat_dau: "", 
        Ngay_ket_thuc: "" 
      });
    } catch (error) {
      console.error("Lỗi khi thêm khoản nợ:", error);
    }
  };

  const handleDeleteDebt = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/quanlyno/${id}`);
      setDebts(debts.filter(d => d.ID_quan_ly !== id));
    } catch (error) {
      console.error("Lỗi khi xóa khoản nợ:", error);
    }
  };

  return (
    <div className="debt">
      <div className="debt__stats">
        {stats.map((stat, idx) => (
          <div className={`debt__stat debt__stat--${stat.color}`} key={idx}>
            <div className="debt__stat-title">{stat.title}</div>
            <div className="debt__stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="debt__form">
        <h3>Thêm khoản nợ mới</h3>
        <form onSubmit={handleAddDebt}>
          <div className="debt__form-row">
            <input
              type="text"
              placeholder="Tên khoản nợ"
              value={form.Ten_khoan}
              onChange={e => setForm({...form, Ten_khoan: e.target.value})}
            />
            <select
              value={form.Loai_khoan}
              onChange={e => setForm({...form, Loai_khoan: e.target.value})}
            >
              <option value="">Chọn loại nợ</option>
              <option value="Thẻ tín dụng">Thẻ tín dụng</option>
              <option value="Vay tiêu dùng">Vay tiêu dùng</option>
              <option value="Vay mua nhà">Vay mua nhà</option>
              <option value="Vay mua xe">Vay mua xe</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div className="debt__form-row">
            <input
              type="number"
              placeholder="Số tiền"
              value={form.So_tien}
              onChange={e => setForm({...form, So_tien: Number(e.target.value)})}
            />
            <input
              type="number"
              placeholder="Lãi suất (%)"
              value={form.Lai_suat}
              onChange={e => setForm({...form, Lai_suat: Number(e.target.value)})}
            />
          </div>
          <div className="debt__form-row">
            <input
              type="date"
              placeholder="Ngày bắt đầu"
              value={form.Ngay_bat_dau}
              onChange={e => setForm({...form, Ngay_bat_dau: e.target.value})}
            />
            <input
              type="date"
              placeholder="Ngày kết thúc"
              value={form.Ngay_ket_thuc}
              onChange={e => setForm({...form, Ngay_ket_thuc: e.target.value})}
            />
          </div>
          <button type="submit" className="debt__form-submit">Thêm khoản nợ</button>
        </form>
      </div>

      <div className="debt__list">
        <h3>Danh sách khoản nợ</h3>
        {debts.map((debt) => (
          <div className="debt__item" key={debt.ID_quan_ly}>
            <div className="debt__item-info">
              <div className="debt__item-name">{debt.Ten_khoan}</div>
              <div className="debt__item-type">{debt.Loai_khoan}</div>
            </div>
            <div className="debt__item-amount">
              {debt.So_tien.toLocaleString("vi-VN")} đ
            </div>
            <div className="debt__item-interest">{debt.Lai_suat}%</div>
            <div className="debt__item-dates">
              <div>Từ: {new Date(debt.Ngay_bat_dau).toLocaleDateString("vi-VN")}</div>
              <div>Đến: {new Date(debt.Ngay_ket_thuc).toLocaleDateString("vi-VN")}</div>
            </div>
            <button
              className="debt__item-delete"
              onClick={() => handleDeleteDebt(debt.ID_quan_ly)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 