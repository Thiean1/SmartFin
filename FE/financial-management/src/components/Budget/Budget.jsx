import React, { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import "./Budget.scss";

const stats = [
  { title: "Tổng ngân sách", value: "10,500,000 ₫", color: "blue" },
  { title: "Đã chi tiêu", value: "7,700,000 ₫", color: "orange" },
  { title: "Còn lại", value: "2,800,000 ₫", color: "green" },
];

const initialBudgets = [
  { name: "Ăn uống", color: "#3b82f6", used: 3500000, total: 4000000 },
  { name: "Giao thông", color: "#22c55e", used: 1200000, total: 1500000 },
  { name: "Giải trí", color: "#a78bfa", used: 800000, total: 1000000 },
  { name: "Mua sắm", color: "#fb923c", used: 2000000, total: 3000000 },
  { name: "Y tế", color: "#ef4444", used: 200000, total: 1000000 },
];

export default function Budget() {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [form, setForm] = useState({ name: "", total: 0 });

  const totalBudget = budgets.reduce((sum, b) => sum + b.total, 0);
  const totalUsed = budgets.reduce((sum, b) => sum + b.used, 0);
  const totalLeft = totalBudget - totalUsed;
  const percentUsed = totalBudget ? (totalUsed / totalBudget) * 100 : 0;

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.total) return;
    setBudgets([
      ...budgets,
      { name: form.name, color: "#3b82f6", used: 0, total: Number(form.total) },
    ]);
    setForm({ name: "", total: 0 });
  };

  return (
    <div className="budget-page">
      <div className="budget-stats">
        <div className="budget-stat budget-stat--blue">
          <div className="budget-stat__title">Tổng ngân sách</div>
          <div className="budget-stat__value budget-stat__value--blue">{totalBudget.toLocaleString()} ₫</div>
        </div>
        <div className="budget-stat budget-stat--orange">
          <div className="budget-stat__title">Đã chi tiêu</div>
          <div className="budget-stat__value budget-stat__value--orange">{totalUsed.toLocaleString()} ₫</div>
        </div>
        <div className="budget-stat budget-stat--green">
          <div className="budget-stat__title">Còn lại</div>
          <div className="budget-stat__value budget-stat__value--green">{totalLeft.toLocaleString()} ₫</div>
        </div>
      </div>
      <div className="budget-top-grid">
        <form className="budget-add-card" onSubmit={handleAddBudget}>
          <div className="budget-add-title">Thêm ngân sách mới</div>
          <div className="budget-add-desc">Thiết lập ngân sách cho danh mục chi tiêu</div>
          <div className="budget-add-group">
            <label>Danh mục</label>
            <input type="text" placeholder="Ví dụ: Ăn uống, Giao thông..." value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="budget-add-group">
            <label>Số tiền ngân sách</label>
            <input type="number" min={0} value={form.total} onChange={e => setForm({ ...form, total: e.target.value })} />
          </div>
          <button className="budget-add-btn" type="submit">+ Thêm ngân sách</button>
        </form>
        <div className="budget-overview-card">
          <div className="budget-overview-title">Tổng quan ngân sách</div>
          <div className="budget-overview-desc">Tiến độ sử dụng ngân sách tổng thể</div>
          <div className="budget-overview-progress-row">
            <div className="budget-overview-progress-label">Đã sử dụng</div>
            <div className="budget-overview-progress-bar">
              <div className="budget-overview-progress-bar-inner" style={{ width: `${percentUsed}%` }}></div>
            </div>
            <div className="budget-overview-progress-percent">{percentUsed.toFixed(1)}%</div>
          </div>
          <div className="budget-overview-info">
            <span>Ngân sách<br /><b>{totalBudget.toLocaleString()} ₫</b></span>
            <span>Đã chi<br /><b>{totalUsed.toLocaleString()} ₫</b></span>
          </div>
        </div>
      </div>
      <div className="budget-detail-card">
        <div className="budget-detail-title">Chi tiết ngân sách theo danh mục</div>
        <div className="budget-detail-desc">Theo dõi tiến độ chi tiêu cho từng danh mục</div>
        {budgets.map((b, i) => {
          const percent = b.total ? (b.used / b.total) * 100 : 0;
          const left = b.total - b.used;
          return (
            <div className="budget-detail-row" key={i}>
              <div className="budget-detail-row-top">
                <span className="budget-detail-dot" style={{ background: b.color }}></span>
                <span className="budget-detail-name">{b.name}</span>
                <span className="budget-detail-percent" style={{ color: percent >= 80 ? '#eab308' : percent >= 60 ? '#22c55e' : '#ef4444' }}>{percent.toFixed(1)}%</span>
                <span className="budget-detail-amount">{b.used.toLocaleString()} / {b.total.toLocaleString()} ₫</span>
                <button className="budget-detail-btn" title="Chỉnh sửa"><Edit2 size={16} /></button>
                <button className="budget-detail-btn" title="Xóa"><Trash2 size={16} /></button>
              </div>
              <div className="budget-detail-progress-bar">
                <div className="budget-detail-progress-bar-inner" style={{ width: `${percent}%`, background: b.color }}></div>
              </div>
              <div className="budget-detail-row-bottom">
                <span className="budget-detail-left">Còn lại: {left.toLocaleString()} ₫</span>
                <span className="budget-detail-left-percent">{(100 - percent).toFixed(1)}% còn lại</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 