import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import "./Report.scss";

export default function Report() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.ID_nguoi_dung;
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [activeTab, setActiveTab] = useState("spending");
  const [transactions, setTransactions] = useState([]);
  const [savings, setSavings] = useState([]);
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    if (!userId) return;
    // Fetch transactions
    axios.get(`http://localhost:5000/api/giaodich?userId=${userId}`).then(res => {
      setTransactions(res.data);
    });
    // Fetch savings
    axios.get(`http://localhost:5000/api/saving?userId=${userId}`).then(res => {
      setSavings(res.data);
    });
    // Fetch debts
    axios.get(`http://localhost:5000/api/quanlyno?userId=${userId}`).then(res => {
      setDebts(res.data);
    });
  }, [userId]);

  // Calculate total income and expenses
  const totalIncome = transactions
    .filter(t => t.Loai === "Thu nhập")
    .reduce((sum, t) => sum + t.So_tien, 0);
  
  const totalExpense = transactions
    .filter(t => t.Loai === "Chi tiêu")
    .reduce((sum, t) => sum + t.So_tien, 0);

  // Calculate total savings
  const totalSaving = savings.reduce((sum, s) => sum + (s.So_tien || 0), 0);

  // Calculate savings rate
  const savingsRate = totalIncome > 0 ? ((totalSaving / totalIncome) * 100).toFixed(1) + "%" : "0%";

  const stats = [
    { 
      title: "Thu nhập", 
      value: totalIncome, 
      color: "green", 
      desc: "Tổng thu nhập thực tế" 
    },
    { 
      title: "Chi tiêu", 
      value: totalExpense, 
      color: "red", 
      desc: "Tổng chi tiêu thực tế" 
    },
    { 
      title: "Tiết kiệm", 
      value: totalSaving, 
      color: "blue", 
      desc: "Tổng tiết kiệm thực tế" 
    },
    { 
      title: "Tỷ lệ tiết kiệm", 
      value: savingsRate, 
      color: "purple", 
      desc: "Mục tiêu: 20%" 
    },
  ];

  // Group transactions by category
  const categoryData = transactions
    .filter(t => t.Loai === "Chi tiêu")
    .reduce((acc, t) => {
      const category = t.Danh_muc || "Khác";
      if (!acc[category]) {
        acc[category] = { spent: 0, budget: 0 };
      }
      acc[category].spent += t.So_tien;
      return acc;
    }, {});

  const categories = Object.entries(categoryData).map(([name, data]) => ({
    name,
    spent: data.spent,
    budget: data.budget || data.spent * 1.2, // Default budget if not set
  }));

  // Generate trend data from transactions
  const trendData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.Ngay);
      return date.getMonth() + 1 === month && date.getFullYear() === selectedYear;
    });

    const income = monthTransactions
      .filter(t => t.Loai === "Thu nhập")
      .reduce((sum, t) => sum + t.So_tien, 0);

    const spending = monthTransactions
      .filter(t => t.Loai === "Chi tiêu")
      .reduce((sum, t) => sum + t.So_tien, 0);

    const saving = income - spending;

    return {
      month: month.toString(),
      income,
      spending,
      saving,
    };
  });

  const getStatus = (percent) => {
    if (percent < 80) return { label: "Tốt", color: "#22c55e" };
    if (percent < 100) return { label: "Cảnh báo", color: "#f59e42" };
    return { label: "Vượt ngân sách", color: "#ef4444" };
  };

  return (
    <div className="report-page">
      <div className="report-header-card">
        <div className="report-header-title">
          <span>📅</span> Báo cáo tài chính
        </div>
        <div className="report-header-desc">
          Tổng quan chi tiết về tình hình tài chính trong thời gian bạn chọn
        </div>
        <div className="report-date-picker">
          <select value={selectedDay} onChange={e => setSelectedDay(Number(e.target.value))}>
            {[...Array(31)].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>
          <span>/</span>
          <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
            {[...Array(12)].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>
          <span>/</span>
          <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
            {[...Array(6)].map((_, i) => (
              <option key={2022+i} value={2022+i}>{2022+i}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="report-stats-row">
        {stats.map((s, idx) => (
          <div className={`report-stat-card report-stat-card--${s.color}`} key={idx}>
            <div className="report-stat-title">{s.title}</div>
            <div className="report-stat-value">
              {typeof s.value === 'number' ? s.value.toLocaleString('vi-VN') + ' đ' : s.value}
            </div>
            <div className="report-stat-desc">{s.desc}</div>
          </div>
        ))}
      </div>
      <div className="report-tabs">
        <button className={activeTab === 'spending' ? 'active' : ''} onClick={() => setActiveTab('spending')}>Chi tiêu</button>
        <button className={activeTab === 'trend' ? 'active' : ''} onClick={() => setActiveTab('trend')}>Xu hướng</button>
        <button className={activeTab === 'goal' ? 'active' : ''} onClick={() => setActiveTab('goal')}>Mục tiêu</button>
        <button className={activeTab === 'analysis' ? 'active' : ''} onClick={() => setActiveTab('analysis')}>Phân tích</button>
      </div>
      {activeTab === 'spending' && (
        <div className="report-category-list">
          <div className="report-category-title">Chi tiêu theo danh mục</div>
          <div className="report-category-desc">Phân tích chi tiết chi tiêu trong ngày {selectedDay}/{selectedMonth}/{selectedYear}</div>
          {categories.map((cat, idx) => {
            const percent = Math.round((cat.spent / cat.budget) * 100);
            const status = getStatus(percent);
            return (
              <div className="report-category-row" key={idx}>
                <div className="report-category-row-top">
                  <span className="report-category-name">{cat.name}</span>
                  <span className="report-category-status" style={{ color: status.color }}>{status.label}</span>
                  <span className="report-category-amount">{cat.spent.toLocaleString('vi-VN')} đ</span>
                  <span className="report-category-percent">
                    {((cat.spent / totalExpense) * 100).toFixed(1)}% tổng chi tiêu
                  </span>
                </div>
                <div className="report-category-budget">Ngân sách: {cat.budget.toLocaleString('vi-VN')} đ</div>
                <div className="report-category-progress-bar">
                  <div 
                    className="report-category-progress-bar-inner" 
                    style={{ width: percent + '%', background: status.color }} 
                  />
                </div>
                <div className="report-category-progress-label">{percent}% đã sử dụng</div>
              </div>
            );
          })}
        </div>
      )}
      {activeTab === 'trend' && (
        <div className="report-trend-card">
          <div className="report-category-title">Xu hướng tài chính năm {selectedYear}</div>
          <div className="report-category-desc">Biểu đồ thu nhập, chi tiêu, tiết kiệm theo tháng</div>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={v => v.toLocaleString('vi-VN')} />
                <Tooltip formatter={v => v.toLocaleString('vi-VN') + ' đ'} />
                <Legend />
                <Line type="monotone" dataKey="income" name="Thu nhập" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="spending" name="Chi tiêu" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="saving" name="Tiết kiệm" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
} 