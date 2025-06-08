import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.scss";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.ID_nguoi_dung;
  const [transactions, setTransactions] = useState([]);
  const [savings, setSavings] = useState([]);
  const [debts, setDebts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    if (!userId) return;
    // Fetch transactions
    axios.get(`http://localhost:5000/api/giaodich?userId=${userId}`).then(res => setTransactions(res.data));
    // Fetch savings
    axios.get(`http://localhost:5000/api/saving?userId=${userId}`).then(res => setSavings(res.data));
    // Fetch debts
    axios.get(`http://localhost:5000/api/quanlyno?userId=${userId}`).then(res => setDebts(res.data));
    // Fetch budgets
    axios.get(`http://localhost:5000/api/danhmuc?userId=${userId}`).then(res => setBudgets(res.data));
    // Fetch goals
    axios.get(`http://localhost:5000/api/muctieu?userId=${userId}`).then(res => setGoals(res.data));
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

  // Tính toán ngân sách từ danh mục
  const budgetData = budgets.map(budget => {
    const used = transactions
      .filter(t => t.ID_danh_muc === budget.ID_danh_muc && t.Loai === "Chi tiêu")
      .reduce((sum, t) => sum + t.So_tien, 0);
    return {
      name: budget.Ten_danh_muc,
      used: used,
      total: budget.So_tien_muc_tieu || used * 1.2, // Nếu không có mục tiêu, lấy 120% chi tiêu thực tế
    };
  });

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
          <div className="dashboard__section-title">🎯 Mục tiêu tiết kiệm</div>
          <div className="dashboard__section-desc">Theo dõi tiến độ các mục tiêu</div>
          {goals.map((goal) => (
            <div className="dashboard__progress-row" key={goal.ID_muc_tieu}>
              <div className="dashboard__progress-label">
                {goal.Ten_muc_tieu}
                <span className="dashboard__progress-amount">
                  {goal.So_tien_da_dat.toLocaleString()} / {goal.So_tien_muc_tieu.toLocaleString()} đ
                </span>
              </div>
              <div className="dashboard__progress-bar">
                <div
                  className="dashboard__progress-bar-inner"
                  style={{ width: `${(goal.So_tien_da_dat / goal.So_tien_muc_tieu) * 100}%` }}
                ></div>
              </div>
              <div className="dashboard__progress-percent">
                {((goal.So_tien_da_dat / goal.So_tien_muc_tieu) * 100).toFixed(1)}% đã đạt được
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 