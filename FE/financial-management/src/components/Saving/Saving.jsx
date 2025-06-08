import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import "./Saving.scss";

export default function Saving() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.ID_nguoi_dung;
  const [activeTab, setActiveTab] = useState("saving");
  const [savings, setSavings] = useState([]);
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    Ten_muc_tieu: "",
    So_tien_muc_tieu: "",
    So_tien_da_dat: "0",
    Han_hoan_thanh: "",
    ID_danh_muc: ""
  });

  useEffect(() => {
    if (!userId) return;
    // Fetch savings
    axios.get(`http://localhost:5000/api/saving?userId=${userId}`).then(res => {
      setSavings(res.data);
    });
    // Fetch goals
    axios.get(`http://localhost:5000/api/muctieu?userId=${userId}`).then(res => {
      setGoals(res.data);
    });
  }, [userId]);

  // Calculate total savings
  const totalSaving = savings.reduce((sum, s) => sum + (s.So_tien || 0), 0);
  const totalGoal = goals.reduce((sum, g) => sum + g.So_tien_muc_tieu, 0);
  const totalInvested = savings.filter(s => s.Loai_khoan === "Đầu tư").reduce((sum, s) => sum + (s.So_tien || 0), 0);
  const totalProfit = savings.filter(s => s.Loai_khoan === "Đầu tư").reduce((sum, s) => sum + (s.Lai_suat || 0), 0);

  const stats = [
    { title: "Tổng tiết kiệm", value: totalSaving.toLocaleString("vi-VN") + " đ", color: "purple" },
    { title: "Mục tiêu tiết kiệm", value: totalGoal.toLocaleString("vi-VN") + " đ", color: "purple-light" },
    { title: "Giá trị đầu tư", value: totalInvested.toLocaleString("vi-VN") + " đ", color: "green" },
    { title: "Lãi/lỗ đầu tư", value: totalProfit.toLocaleString("vi-VN") + " đ", color: "orange" },
  ];

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!form.Ten_muc_tieu.trim() || !form.So_tien_muc_tieu || !form.Han_hoan_thanh) return;

    try {
      const response = await axios.post("http://localhost:5000/api/muctieu", {
        ...form,
        ID_nguoi_dung: userId
      });
      setGoals([...goals, response.data]);
      setForm({
        Ten_muc_tieu: "",
        So_tien_muc_tieu: "",
        So_tien_da_dat: "0",
        Han_hoan_thanh: "",
        ID_danh_muc: ""
      });
    } catch (error) {
      console.error("Lỗi khi thêm mục tiêu:", error);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/muctieu/${id}`);
      setGoals(goals.filter(g => g.ID_muc_tieu !== id));
    } catch (error) {
      console.error("Lỗi khi xóa mục tiêu:", error);
    }
  };

  function daysLeft(deadline) {
    if (!deadline) return null;
    const now = new Date();
    const end = new Date(deadline);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }

  return (
    <div className="saving">
      <div className="saving__stats">
        {stats.map((stat, idx) => (
          <div className={`saving__stat saving__stat--${stat.color}`} key={idx}>
            <div className="saving__stat-title">{stat.title}</div>
            <div className="saving__stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="saving__tabs">
        <button 
          className={activeTab === 'saving' ? 'active' : ''} 
          onClick={() => setActiveTab('saving')}
        >
          Tiết kiệm
        </button>
        <button 
          className={activeTab === 'investment' ? 'active' : ''} 
          onClick={() => setActiveTab('investment')}
        >
          Đầu tư
        </button>
      </div>

      {activeTab === 'saving' && (
        <div className="saving__goals">
          <div className="saving__form">
            <h3>Thêm mục tiêu tiết kiệm mới</h3>
            <form onSubmit={handleAddGoal}>
              <div className="saving__form-row">
                <input
                  type="text"
                  placeholder="Tên mục tiêu"
                  value={form.Ten_muc_tieu}
                  onChange={e => setForm({...form, Ten_muc_tieu: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Số tiền mục tiêu"
                  value={form.So_tien_muc_tieu}
                  onChange={e => setForm({...form, So_tien_muc_tieu: e.target.value})}
                />
              </div>
              <div className="saving__form-row">
                <input
                  type="number"
                  placeholder="Số tiền đã tiết kiệm"
                  value={form.So_tien_da_dat}
                  onChange={e => setForm({...form, So_tien_da_dat: e.target.value})}
                />
                <input
                  type="date"
                  placeholder="Hạn hoàn thành"
                  value={form.Han_hoan_thanh}
                  onChange={e => setForm({...form, Han_hoan_thanh: e.target.value})}
                />
              </div>
              <button type="submit" className="saving__form-submit">Thêm mục tiêu</button>
            </form>
          </div>

          <div className="saving__list">
            <h3>Danh sách mục tiêu tiết kiệm</h3>
            {goals.map((goal) => (
              <div className="saving__item" key={goal.ID_muc_tieu}>
                <div className="saving__item-info">
                  <div className="saving__item-name">{goal.Ten_muc_tieu}</div>
                  <div className="saving__item-progress">
                    {((goal.So_tien_da_dat / goal.So_tien_muc_tieu) * 100).toFixed(1)}% hoàn thành
                  </div>
                </div>
                <div className="saving__item-amount">
                  {goal.So_tien_da_dat.toLocaleString("vi-VN")} / {goal.So_tien_muc_tieu.toLocaleString("vi-VN")} đ
                </div>
                <div className="saving__item-deadline">
                  Còn {daysLeft(goal.Han_hoan_thanh)} ngày
                </div>
                <button
                  className="saving__item-delete"
                  onClick={() => handleDeleteGoal(goal.ID_muc_tieu)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'investment' && (
        <div className="saving__investments">
          <div className="saving__list">
            <h3>Danh sách đầu tư</h3>
            {savings.filter(s => s.Loai_khoan === "Đầu tư").map((investment) => (
              <div className="saving__item" key={investment.ID_quan_ly}>
                <div className="saving__item-info">
                  <div className="saving__item-name">{investment.Ten_khoan}</div>
                  <div className="saving__item-type">{investment.Loai_khoan}</div>
                </div>
                <div className="saving__item-amount">
                  {investment.So_tien.toLocaleString("vi-VN")} đ
                </div>
                <div className="saving__item-profit">
                  Lãi: {investment.Lai_suat}%
                </div>
                <div className="saving__item-dates">
                  <div>Từ: {new Date(investment.Ngay_bat_dau).toLocaleDateString("vi-VN")}</div>
                  <div>Đến: {new Date(investment.Ngay_ket_thuc).toLocaleDateString("vi-VN")}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 