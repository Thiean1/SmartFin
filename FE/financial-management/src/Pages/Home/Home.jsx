import React, { useEffect, useState } from "react"
import { Brain } from "lucide-react"
import { useNavigate, Outlet, useLocation } from "react-router-dom"
import AvatarDropdown from "../../components/AvatarDropdown"
import "./Home.scss"

const menuItems = [
  { key: "dashboard", icon: "🏠", label: "Dashboard", path: "/home" },
  { key: "spending", icon: "💸", label: "Thu Chi", path: "/home/spending" },
  { key: "ai", icon: "🤖", label: "AI Tư vấn", path: "/home/ai" },
  { key: "budget", icon: "📊", label: "Ngân sách", path: "/home/budget" },
  { key: "debt", icon: "💳", label: "Quản lý nợ", path: "/home/debt" },
  { key: "saving", icon: "💰", label: "Tiết kiệm & Đầu tư", path: "/home/saving" },
  { key: "report", icon: "📈", label: "Báo cáo", path: "/home/report" },
]

const budgetData = [
  { name: "Ăn uống", used: 3500000, total: 4000000 },
  { name: "Giao thông", used: 1200000, total: 1500000 },
  { name: "Giải trí", used: 800000, total: 1000000 },
  { name: "Mua sắm", used: 2000000, total: 3000000 },
]

const goalData = [
  { name: "Mua xe máy mới", current: 45000000, target: 60000000 },
  { name: "Quỹ khẩn cấp", current: 25000000, target: 50000000 },
  { name: "Du lịch Nhật Bản", current: 8000000, target: 30000000 },
]

const statCards = [
  {
    title: "Tổng thu nhập tháng này",
    value: "25,000,000 đ",
    desc: "+12% so với tháng trước",
    color: "green",
    icon: "📈",
  },
  {
    title: "Tổng chi tiêu tháng này",
    value: "18,500,000 đ",
    desc: "+8% so với tháng trước",
    color: "red",
    icon: "📉",
  },
  {
    title: "Tiết kiệm tháng này",
    value: "6,500,000 đ",
    desc: "+15% so với tháng trước",
    color: "blue",
    icon: "💰",
  },
  {
    title: "Tổng nợ hiện tại",
    value: "12,000,000 đ",
    desc: "-5% so với tháng trước",
    color: "orange",
    icon: "💳",
  },
]

export default function Home() {
  const [user, setUser] = useState({ name: "User", email: "user@email.com" })
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="home-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar__logo">
          <Brain size={28} />
          <span>SmartFinance</span>
        </div>
        <nav className="sidebar__menu">
          {menuItems.map((item) => (
            <div
              key={item.key}
              className={`sidebar__menu-item${location.pathname === item.path ? " active" : ""}`}
              onClick={() => navigate(item.path)}
              style={{ userSelect: 'none' }}
            >
              <span className="sidebar__menu-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="sidebar__user">
          <AvatarDropdown user={user} onLogout={handleLogout}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="sidebar__user-avatar">
                {(user.name || user.Ho_va_ten || user.ho_va_ten || "U").charAt(0).toUpperCase()}
              </div>
              <div className="sidebar__user-info">
                <div className="sidebar__user-name">{user.name}</div>
                <div className="sidebar__user-email">{user.Email}</div>
              </div>
            </div>
          </AvatarDropdown>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
