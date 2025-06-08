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

export default function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeKey, setActiveKey] = useState("dashboard")
  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    const path = location.pathname.split("/").pop()
    setActiveKey(path || "dashboard")
  }, [location])

  return (
    <div className="home-layout">
      <div className="sidebar">
        <div className="sidebar__logo">
          <Brain size={24} />
          <span>SmartFin</span>
        </div>
        <div className="sidebar__menu">
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`sidebar__menu-item ${activeKey === item.key ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar__menu-icon">{item.icon}</span>
              <span className="sidebar__menu-label">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="sidebar__user">
          <div className="sidebar__user-avatar">
            {user?.Ten_nguoi_dung?.charAt(0) || "U"}
          </div>
          <div className="sidebar__user-info">
            <div className="sidebar__user-name">{user?.Ten_nguoi_dung || "User"}</div>
            <div className="sidebar__user-email">{user?.Email || "user@example.com"}</div>
          </div>
        </div>
      </div>
      <div className="main-content">
        <div className="main-header">
          <AvatarDropdown />
        </div>
        <div className="main-body">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
