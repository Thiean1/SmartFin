import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import "./Debt.scss";

const stats = [
  { title: "Tổng nợ", value: "30,000,000 ₫", color: "red" },
  { title: "Trả tối thiểu/tháng", value: "1,700,000 ₫", color: "orange" },
  { title: "Lãi suất TB", value: "18.0%", color: "yellow" },
];

const initialDebts = [
  {
    name: "Thẻ tín dụng Vietcombank",
    type: "Thẻ tín dụng",
    can_loan: 12000000,
    interest: 24,
    min_pay: 500000,
    months: 20,
    paid: 0.2,
    tag: "Quá hạn",
    tagColor: "#ef4444",
  },
  {
    name: "Vay mua xe máy",
    type: "Vay tiêu dùng",
    can_loan: 18000000,
    interest: 12,
    min_pay: 1200000,
    months: 15,
    paid: 0.4,
    tag: "Ưu tiên trả sớm",
    tagColor: "#22c55e",
  },
];

export default function Debt() {
  const [debts, setDebts] = useState([]);
  const [form, setForm] = useState({ name: "", type: "", can_loan: 0, interest: 0, min_pay: 0, months: 0, date: "" });

  // Load từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("debts");
    if (saved) setDebts(JSON.parse(saved));
    else setDebts(initialDebts);
  }, []);

  // Lưu vào localStorage khi debts thay đổi
  useEffect(() => {
    localStorage.setItem("debts", JSON.stringify(debts));
  }, [debts]);

  const totalDebt = debts.reduce((sum, d) => sum + d.can_loan, 0);
  const totalMinPay = debts.reduce((sum, d) => sum + d.min_pay, 0);
  const avgInterest = debts.length ? debts.reduce((sum, d) => sum + d.interest, 0) / debts.length : 0;

  const handleAddDebt = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.type || !form.can_loan) return;
    setDebts([
      ...debts,
      { ...form, paid: 0, tag: "", tagColor: "#3b82f6" },
    ]);
    setForm({ name: "", type: "", can_loan: 0, interest: 0, min_pay: 0, months: 0, date: "" });
  };

  const handleDelete = (idx) => {
    setDebts(debts.filter((_, i) => i !== idx));
  };

  // Trả nợ từng phần: tăng paid lên 10% (tối đa 100%), giảm số nợ còn lại
  const handlePay = (idx) => {
    setDebts(debts.map((d, i) => {
      if (i !== idx) return d;
      const newPaid = Math.min(1, d.paid + 0.1);
      const newCanLoan = Math.max(0, d.can_loan - d.can_loan * 0.1);
      return { ...d, paid: newPaid, can_loan: newCanLoan };
    }));
  };

  return (
    <div className="debt-page">
      <div className="debt-stats">
        <div className="debt-stat debt-stat--red">
          <div className="debt-stat__title">Tổng nợ</div>
          <div className="debt-stat__value debt-stat__value--red">{totalDebt.toLocaleString()} ₫</div>
        </div>
        <div className="debt-stat debt-stat--orange">
          <div className="debt-stat__title">Trả tối thiểu/tháng</div>
          <div className="debt-stat__value debt-stat__value--orange">{totalMinPay.toLocaleString()} ₫</div>
        </div>
        <div className="debt-stat debt-stat--yellow">
          <div className="debt-stat__title">Lãi suất TB</div>
          <div className="debt-stat__value debt-stat__value--yellow">{avgInterest.toFixed(1)}%</div>
        </div>
      </div>
      <div className="debt-top-grid">
        <form className="debt-add-card" onSubmit={handleAddDebt}>
          <div className="debt-add-title">Thêm khoản nợ mới</div>
          <div className="debt-add-desc">Ghi lại các khoản nợ để quản lý hiệu quả</div>
          <div className="debt-add-group">
            <label>Tên khoản nợ</label>
            <input type="text" placeholder="VD: Thẻ tín dụng ABC" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="debt-add-group">
            <label>Loại nợ</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="">Chọn loại nợ</option>
              <option>Thẻ tín dụng</option>
              <option>Vay tiêu dùng</option>
              <option>Vay mua nhà</option>
              <option>Khác</option>
            </select>
          </div>
          <div className="debt-add-row">
            <div className="debt-add-group">
              <label>Tổng số nợ</label>
              <input type="number" min={0} value={form.can_loan} onChange={e => setForm({ ...form, can_loan: e.target.value })} />
            </div>
            <div className="debt-add-group">
              <label>Số nợ còn lại</label>
              <input type="number" min={0} value={form.can_loan} disabled />
            </div>
          </div>
          <div className="debt-add-row">
            <div className="debt-add-group">
              <label>Lãi suất (%/năm)</label>
              <input type="number" min={0} value={form.interest} onChange={e => setForm({ ...form, interest: e.target.value })} />
            </div>
            <div className="debt-add-group">
              <label>Trả tối thiểu/tháng</label>
              <input type="number" min={0} value={form.min_pay} onChange={e => setForm({ ...form, min_pay: e.target.value })} />
            </div>
          </div>
          <div className="debt-add-group">
            <label>Ngày đến hạn</label>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>
          <button className="debt-add-btn" type="submit">+ Thêm khoản nợ</button>
        </form>
        <div className="debt-strategy-card">
          <div className="debt-strategy-title">Chiến lược trả nợ</div>
          <div className="debt-strategy-desc">Gợi ý tối ưu hóa việc trả nợ</div>
          <div className="debt-strategy-method debt-strategy-method--blue">Phương pháp Snowball</div>
          <div className="debt-strategy-method-desc">Ưu tiên trả các khoản nợ nhỏ trước để tạo động lực tâm lý</div>
          <div className="debt-strategy-method debt-strategy-method--green">Phương pháp Avalanche</div>
          <div className="debt-strategy-method-desc">Ưu tiên trả các khoản nợ lãi suất cao trước để tiết kiệm tiền lãi</div>
          <div className="debt-strategy-advice">
            <b>Lời khuyên</b><br />
            <ul>
              <li>Luôn trả tối thiểu cho tất cả các khoản nợ</li>
              <li>Tập trung trả thêm 1 khoản nợ ưu tiên</li>
              <li>Tránh tạo thêm nợ mới khi đang trả nợ</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="debt-list-card">
        <div className="debt-list-title">Danh sách khoản nợ</div>
        <div className="debt-list-desc">Quản lý và theo dõi tiến độ trả nợ</div>
        {debts.map((d, i) => (
          <div className="debt-list-row" key={i}>
            <div className="debt-list-row-top">
              <span className="debt-list-tag" style={{ background: d.tagColor }}>{d.tag}</span>
              <span className="debt-list-name">{d.name}</span>
              <span className="debt-list-type">{d.type}</span>
              <span className="debt-list-amount">Cần trả: {d.can_loan.toLocaleString()} ₫</span>
              <span className="debt-list-interest">Lãi suất {d.interest}%/năm</span>
              <span className="debt-list-minpay">Trả tối thiểu {d.min_pay.toLocaleString()} ₫</span>
              <span className="debt-list-months">Thời gian trả {d.months} tháng</span>
              <button className="debt-list-btn" title="Xóa" onClick={() => handleDelete(i)}><Trash2 size={16} /></button>
            </div>
            <div className="debt-list-progress-bar">
              <div className="debt-list-progress-bar-inner" style={{ width: `${d.paid * 100}%`, background: d.tagColor }}></div>
            </div>
            <div className="debt-list-row-bottom">
              <span className="debt-list-paid">Đã trả nợ</span>
              <span className="debt-list-paid-percent">{(d.paid * 100).toFixed(1)}%</span>
              <button className="debt-list-pay-btn" onClick={() => handlePay(i)}>Đã trả nợ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 