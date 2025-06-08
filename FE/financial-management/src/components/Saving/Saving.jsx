import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import "./Saving.scss";

const initialGoals = [
  {
    name: "Mua xe máy mới",
    category: "Phương tiện",
    saved: 45000000,
    target: 60000000,
    deadline: "2024-06-01",
    method: "Phương án",
  },
  {
    name: "Quỹ khẩn cấp",
    category: "Quỹ khẩn cấp",
    saved: 25000000,
    target: 50000000,
    deadline: "2024-12-31",
    method: "Quỹ khẩn cấp",
  },
  {
    name: "Du lịch Nhật Bản",
    category: "Du lịch",
    saved: 8000000,
    target: 30000000,
    deadline: "2024-08-15",
    method: "Du lịch",
  },
];

const stats = [
  { title: "Tổng tiết kiệm", value: 78000000, color: "purple" },
  { title: "Mục tiêu tiết kiệm", value: 140000000, color: "purple-light" },
  { title: "Giá trị đầu tư", value: 26600000, color: "green" },
  { title: "Lãi/lỗ đầu tư", value: 1600000, color: "orange" },
];

const categories = ["Phương tiện", "Quỹ khẩn cấp", "Du lịch", "Nhà ở", "Khác"];

function daysLeft(deadline) {
  if (!deadline) return null;
  const now = new Date();
  const end = new Date(deadline);
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export default function Saving() {
  const [activeTab, setActiveTab] = useState("saving");
  const [savingGoals, setSavingGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: "",
    method: "saving"
  });
  const [editingGoal, setEditingGoal] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);

  // Load từ localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem("savingGoals");
    if (savedGoals) {
      setSavingGoals(JSON.parse(savedGoals));
    } else {
      setSavingGoals(initialGoals);
    }
  }, []);

  // Lưu vào localStorage khi goals thay đổi
  useEffect(() => {
    localStorage.setItem("savingGoals", JSON.stringify(savingGoals));
  }, [savingGoals]);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) {
      showNotification("Vui lòng điền đầy đủ thông tin", "error");
      return;
    }

    const goal = {
      ...newGoal,
      id: Date.now(),
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount),
      deadline: new Date(newGoal.deadline).toISOString()
    };

    setSavingGoals([...savingGoals, goal]);
    setNewGoal({
      name: "",
      targetAmount: "",
      currentAmount: "0",
      deadline: "",
      method: "saving"
    });
    showNotification("Thêm mục tiêu tiết kiệm thành công!", "success");
  };

  const handleAddMoney = (goalId, amount) => {
    if (!amount || isNaN(amount) || amount <= 0) {
      showNotification("Vui lòng nhập số tiền hợp lệ", "error");
      return;
    }

    setSavingGoals(savingGoals.map(goal => {
      if (goal.id === goalId) {
        const newAmount = goal.currentAmount + parseFloat(amount);
        if (newAmount > goal.targetAmount) {
          showNotification("Số tiền vượt quá mục tiêu!", "warning");
          return goal;
        }
        showNotification("Thêm tiền thành công!", "success");
        return { ...goal, currentAmount: newAmount };
      }
      return goal;
    }));
  };

  const handleDeleteGoal = (goalId) => {
    setSavingGoals(savingGoals.filter(goal => goal.id !== goalId));
    setShowDeleteConfirm(null);
    showNotification("Xóa mục tiêu thành công!", "success");
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setNewGoal({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline.split("T")[0],
      method: goal.method
    });
  };

  const handleUpdateGoal = (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) {
      showNotification("Vui lòng điền đầy đủ thông tin", "error");
      return;
    }

    setSavingGoals(savingGoals.map(goal => {
      if (goal.id === editingGoal.id) {
        return {
          ...goal,
          name: newGoal.name,
          targetAmount: parseFloat(newGoal.targetAmount),
          currentAmount: parseFloat(newGoal.currentAmount),
          deadline: new Date(newGoal.deadline).toISOString(),
          method: newGoal.method
        };
      }
      return goal;
    }));

    setEditingGoal(null);
    setNewGoal({
      name: "",
      targetAmount: "",
      currentAmount: "0",
      deadline: "",
      method: "saving"
    });
    showNotification("Cập nhật mục tiêu thành công!", "success");
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const totalSaved = savingGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = savingGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const progress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="saving-page">
      <div className="saving-stats">
        <div className="saving-stat saving-stat--purple">
          <div className="saving-stat__title">Tổng tiết kiệm</div>
          <div className="saving-stat__value saving-stat__value--purple">{totalSaved.toLocaleString()} ₫</div>
        </div>
        <div className="saving-stat saving-stat--purple-light">
          <div className="saving-stat__title">Mục tiêu tiết kiệm</div>
          <div className="saving-stat__value saving-stat__value--purple-light">{totalTarget.toLocaleString()} ₫</div>
        </div>
        <div className="saving-stat saving-stat--green">
          <div className="saving-stat__title">Giá trị đầu tư</div>
          <div className="saving-stat__value saving-stat__value--green">26,600,000 ₫</div>
        </div>
        <div className="saving-stat saving-stat--orange">
          <div className="saving-stat__title">Lãi/lỗ đầu tư</div>
          <div className="saving-stat__value saving-stat__value--orange">+1,600,000 ₫</div>
        </div>
      </div>
      <div className="saving-tabs">
        <button className={activeTab === "saving" ? "active" : ""} onClick={() => setActiveTab("saving")}>Tiết kiệm</button>
        <button className={activeTab === "investment" ? "active" : ""} onClick={() => setActiveTab("investment")}>Đầu tư</button>
      </div>
      <div className="saving-top-grid">
        <div className="saving-add-card">
          <div className="saving-add-title">
            {editingGoal ? "Chỉnh sửa mục tiêu" : "Thêm mục tiêu mới"}
          </div>
          <div className="saving-add-desc">
            {editingGoal ? "Cập nhật thông tin mục tiêu tiết kiệm của bạn" : "Tạo mục tiêu tiết kiệm mới để theo dõi"}
          </div>
          <form onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal}>
            <div className="saving-add-group">
              <label>Tên mục tiêu</label>
              <input
                type="text"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                placeholder="Ví dụ: Mua xe máy"
              />
            </div>
            <div className="saving-add-group">
              <label>Số tiền mục tiêu</label>
              <input
                type="number"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                placeholder="Ví dụ: 20000000"
              />
            </div>
            {editingGoal && (
              <div className="saving-add-group">
                <label>Số tiền hiện tại</label>
                <input
                  type="number"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                  placeholder="Ví dụ: 5000000"
                />
              </div>
            )}
            <div className="saving-add-group">
              <label>Hạn hoàn thành</label>
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
            </div>
            <div className="saving-add-group">
              <label>Phương thức</label>
              <select
                value={newGoal.method}
                onChange={(e) => setNewGoal({ ...newGoal, method: e.target.value })}
              >
                <option value="saving">Tiết kiệm</option>
                <option value="investment">Đầu tư</option>
              </select>
            </div>
            <button type="submit" className="saving-add-btn">
              {editingGoal ? "Cập nhật" : "Thêm mục tiêu"}
            </button>
            {editingGoal && (
              <button
                type="button"
                className="saving-add-btn"
                style={{ marginTop: "8px", background: "#ef4444" }}
                onClick={() => {
                  setEditingGoal(null);
                  setNewGoal({
                    name: "",
                    targetAmount: "",
                    currentAmount: "0",
                    deadline: "",
                    method: "saving"
                  });
                }}
              >
                Hủy
              </button>
            )}
          </form>
        </div>
        <div className="saving-overview-card">
          <div className="saving-overview-title">Tổng quan tiết kiệm</div>
          <div className="saving-overview-desc">Theo dõi tiến độ tiết kiệm tổng thể của bạn</div>
          <div className="saving-overview-progress-row">
            <div className="saving-overview-progress-label">Tiến độ chung</div>
            <div className="saving-overview-progress-bar">
              <div
                className="saving-overview-progress-bar-inner"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="saving-overview-progress-percent">
              {progress.toFixed(1)}% hoàn thành
            </div>
          </div>
          <div className="saving-overview-info">
            <span>
              Đã tiết kiệm<br />
              <b>{totalSaved.toLocaleString()} ₫</b>
            </span>
            <span>
              Mục tiêu<br />
              <b>{totalTarget.toLocaleString()} ₫</b>
            </span>
            <span>
              Còn lại<br />
              <b>{(totalTarget - totalSaved).toLocaleString()} ₫</b>
            </span>
          </div>
        </div>
      </div>
      <div className="saving-goal-card">
        <div className="saving-goal-title">Danh sách mục tiêu</div>
        <div className="saving-goal-desc">Quản lý và theo dõi các mục tiêu tiết kiệm của bạn</div>
        {savingGoals
          .filter(goal => goal.method === activeTab)
          .map(goal => (
            <div key={goal.id} className="saving-goal-row">
              <div className="saving-goal-row-top">
                <span className="saving-goal-name">{goal.name}</span>
                <span className="saving-goal-method">
                  {goal.method === "saving" ? "Tiết kiệm" : "Đầu tư"}
                </span>
                <span className="saving-goal-deadline">
                  {new Date(goal.deadline).toLocaleDateString()}
                  {new Date(goal.deadline) < new Date() && (
                    <span className="expired">(Đã hết hạn)</span>
                  )}
                </span>
                <button
                  className="saving-goal-btn"
                  onClick={() => handleEditGoal(goal)}
                >
                  ✏️
                </button>
                <button
                  className="saving-goal-btn"
                  onClick={() => setShowDeleteConfirm(goal.id)}
                >
                  🗑️
                </button>
              </div>
              <div className="saving-goal-progress-bar">
                <div
                  className="saving-goal-progress-bar-inner"
                  style={{
                    width: `${(goal.currentAmount / goal.targetAmount) * 100}%`,
                    background: goal.currentAmount >= goal.targetAmount
                      ? "linear-gradient(90deg, #22c55e 60%, #4ade80 100%)"
                      : "linear-gradient(90deg, #a78bfa 60%, #c4b5fd 100%)"
                  }}
                />
              </div>
              <div className="saving-goal-row-bottom">
                <span className="saving-goal-amount">
                  {goal.currentAmount.toLocaleString()} đ
                </span>
                <span className="saving-goal-target">
                  / {goal.targetAmount.toLocaleString()} đ
                </span>
              </div>
              {goal.currentAmount < goal.targetAmount && (
                <div className="saving-goal-add-row">
                  <input
                    type="number"
                    placeholder="Nhập số tiền muốn thêm"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddMoney(goal.id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <button
                    className="saving-goal-add-btn"
                    onClick={(e) => {
                      const input = e.target.previousSibling;
                      handleAddMoney(goal.id, input.value);
                      input.value = "";
                    }}
                  >
                    Thêm
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
      {showDeleteConfirm && (
        <div className="saving-delete-confirm">
          <div className="saving-delete-content">
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa mục tiêu này?</p>
            <div className="saving-delete-buttons">
              <button
                onClick={() => handleDeleteGoal(showDeleteConfirm)}
                className="saving-delete-confirm-btn"
              >
                Xóa
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="saving-delete-cancel-btn"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
      {notification && (
        <div className={`saving-notification saving-notification--${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
} 