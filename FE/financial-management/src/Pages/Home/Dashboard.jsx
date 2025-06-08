import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.scss";

const budgetData = [
  { name: "Ăn uống", used: 3500000, total: 4000000 },
  { name: "Giao thông", used: 1200000, total: 1500000 },
  { name: "Giải trí", used: 800000, total: 1000000 },
  { name: "Mua sắm", used: 2000000, total: 3000000 },
];

const goalData = [
  { name: "Mua xe máy mới", current: 45000000, target: 60000000 },
  { name: "Quỹ khẩn cấp", current: 25000000, target: 50000000 },
  { name: "Du lịch Nhật Bản", current: 8000000, target: 30000000 },
];

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.ID_nguoi_dung;
  const [transactions, setTransactions] = useState([]);
  const [savings, setSavings] = useState([]);
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:5000/api/giaodich?userId=${userId}`).then(res => setTransactions(res.data));
    axios.get(`http://localhost:5000/api/saving?userId=${userId}`).then(res => setSavings(res.data));
    axios.get(`http://localhost:5000/api/quanlyno?userId=${userId}`).then(res => setDebts(res.data));
  }, [userId]);

  // Tổng hợp dữ liệu
  const totalIncome = transactions.filter(t => t.Loai === "Thu nhập").reduce((sum, t) => sum + t.So_tien, 0);
  const totalExpense = transactions.filter(t => t.Loai === "Chi tiêu").reduce((sum, t) => sum + t.So_tien, 0);
  const totalSaving = savings.reduce((sum, s) => sum + (s.So_tien || 0), 0);
  const totalDebt = debts.reduce((sum, d) => sum + (d.So_tien || 0), 0);

  const statCards = [
    {
      title: "Tổng thu nhập tháng này",
      value: totalIncome.toLocaleString("vi-VN") + " đ",
      desc: "Tổng thu nhập thực tế",
      color: "green",
      icon: "📈",
    },
    {
      title: "Tổng chi tiêu tháng này",
      value: totalExpense.toLocaleString("vi-VN") + " đ",
      desc: "Tổng chi tiêu thực tế",
      color: "red",
      icon: "📉",
    },
    {
      title: "Tiết kiệm tháng này",
      value: totalSaving.toLocaleString("vi-VN") + " đ",
      desc: "Tổng tiết kiệm thực tế",
      color: "blue",
      icon: "💰",
    },
    {
      title: "Tổng nợ hiện tại",
      value: totalDebt.toLocaleString("vi-VN") + " đ",
      desc: "Tổng nợ thực tế",
      color: "orange",
      icon: "💳",
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard__stats">
        {statCards.map((card, idx) => (
          <div className={`dashboard__stat dashboard__stat--${card.color}`} key={idx}>
            <div className="dashboard__stat-icon">{card.icon}</div>
            <div className="dashboard__stat-title">{card.title}</div>
            <div className="dashboard__stat-value">{card.value}</div>
            <div className={`dashboard__stat-desc dashboard__stat-desc--${card.color}`}>{card.desc}</div>
          </div>
        ))}
      </div>
      <div className="dashboard__grid">
        <div className="dashboard__section">
          <div className="dashboard__section-title">🧭 Tiến độ ngân sách tháng này</div>
          <div className="dashboard__section-desc">Theo dõi chi tiêu theo từng danh mục</div>
          {budgetData.map((item) => (
            <div className="dashboard__progress-row" key={item.name}>
              <div className="dashboard__progress-label">
                {item.name}
                <span className="dashboard__progress-amount">
                  {item.used.toLocaleString()} / {item.total.toLocaleString()} đ
                </span>
              </div>
              <div className="dashboard__progress-bar">
                <div
                  className="dashboard__progress-bar-inner"
                  style={{ width: `${(item.used / item.total) * 100}%` }}
                ></div>
              </div>
              <div className="dashboard__progress-percent">
                {((item.used / item.total) * 100).toFixed(1)}% đã sử dụng
              </div>
            </div>
          ))}
        </div>
        <div className="dashboard__section">
          <div className="dashboard__section-title">Mục tiêu tài chính</div>
          <div className="dashboard__section-desc">Tiến độ đạt được các mục tiêu đã đặt ra</div>
          {goalData.map((item) => (
            <div className="dashboard__progress-row" key={item.name}>
              <div className="dashboard__progress-label">
                {item.name}
                <span className="dashboard__progress-amount">
                  {item.current.toLocaleString()} / {item.target.toLocaleString()} đ
                </span>
              </div>
              <div className="dashboard__progress-bar">
                <div
                  className="dashboard__progress-bar-inner dashboard__progress-bar-inner--goal"
                  style={{ width: `${(item.current / item.target) * 100}%` }}
                ></div>
              </div>
              <div className="dashboard__progress-percent">
                {((item.current / item.target) * 100).toFixed(1)}% hoàn thành
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 