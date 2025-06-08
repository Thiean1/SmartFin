import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./Report.scss";

const categories = [
  { name: "Ăn uống", budget: 4000000, spent: 3500000 },
  { name: "Giao thông", budget: 1500000, spent: 1200000 },
  { name: "Mua sắm", budget: 3000000, spent: 2000000 },
  { name: "Giải trí", budget: 1000000, spent: 800000 },
  { name: "Y tế", budget: 1000000, spent: 200000 },
  { name: "Hóa đơn", budget: 1500000, spent: 1500000 },
  { name: "Khác", budget: 8000000, spent: 9300000 },
];

const stats = [
  { title: "Thu nhập", value: 25000000, color: "green", desc: "+0% so với tháng trước" },
  { title: "Chi tiêu", value: 18500000, color: "red", desc: "-2.8% so với tháng trước" },
  { title: "Tiết kiệm", value: 6500000, color: "blue", desc: "+8.3% so với tháng trước" },
  { title: "Tỷ lệ tiết kiệm", value: "26%", color: "purple", desc: "Mục tiêu: 20%" },
];

const getStatus = (percent) => {
  if (percent < 80) return { label: "Tốt", color: "#22c55e" };
  if (percent < 100) return { label: "Cảnh báo", color: "#f59e42" };
  return { label: "Vượt ngân sách", color: "#ef4444" };
};

// Dữ liệu mẫu cho biểu đồ xu hướng
const trendData = [
  { month: "1", income: 22000000, spending: 17000000, saving: 5000000 },
  { month: "2", income: 23000000, spending: 17500000, saving: 5500000 },
  { month: "3", income: 24000000, spending: 18000000, saving: 6000000 },
  { month: "4", income: 25000000, spending: 18500000, saving: 6500000 },
  { month: "5", income: 25500000, spending: 19000000, saving: 6500000 },
  { month: "6", income: 25000000, spending: 18500000, saving: 6500000 },
  { month: "7", income: 26000000, spending: 19500000, saving: 7000000 },
  { month: "8", income: 26500000, spending: 20000000, saving: 7500000 },
  { month: "9", income: 27000000, spending: 21000000, saving: 8000000 },
  { month: "10", income: 27500000, spending: 21500000, saving: 8500000 },
  { month: "11", income: 28000000, spending: 22000000, saving: 9000000 },
  { month: "12", income: 28500000, spending: 22500000, saving: 9500000 },
];

export default function Report() {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [activeTab, setActiveTab] = useState("spending");

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
            <div className="report-stat-value">{typeof s.value === 'number' ? s.value.toLocaleString('vi-VN') + ' đ' : s.value}</div>
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
                  <span className="report-category-percent">{((cat.spent / 18500000) * 100).toFixed(1)}% tổng chi tiêu</span>
                </div>
                <div className="report-category-budget">Ngân sách: {cat.budget.toLocaleString('vi-VN')} đ</div>
                <div className="report-category-progress-bar">
                  <div className="report-category-progress-bar-inner" style={{ width: percent + '%', background: status.color }} />
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
      {/* Các tab khác có thể bổ sung sau */}
    </div>
  );
} 