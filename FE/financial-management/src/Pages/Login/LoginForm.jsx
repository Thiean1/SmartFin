"use client"

import { useState } from "react"
import { Brain, Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import "./LoginForm.scss"

export default function LoginForm({ onLogin, setUser }) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Dữ liệu giả
    const fakeUser = {
      email: "test@gmail.com",
      password: "123456",
      name: "Nguyễn Văn A",
    }

    setTimeout(() => {
      if (
        formData.email === fakeUser.email &&
        formData.password === fakeUser.password
      ) {
        setUser({
          email: fakeUser.email,
          name: fakeUser.name,
        })
        onLogin(true)
      } else {
        alert("Email hoặc mật khẩu không đúng!")
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!")
      return
    }
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setUser({
        email: formData.email,
        name: formData.fullName,
      })
      onLogin(true)
      setIsLoading(false)
    }, 1000)
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    alert("Link đặt lại mật khẩu đã được gửi đến email của bạn!")
  }

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__header">
          <Brain className="auth__logo" />
          <h1 className="auth__title">SmartFinance AI</h1>
          <p className="auth__subtitle">Quản lý tài chính thông minh với AI tư vấn</p>
        </div>

        <div className="auth__tabs">
          <button
            className={`auth__tab ${activeTab === "login" ? "auth__tab--active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Đăng nhập
          </button>
          <button
            className={`auth__tab ${activeTab === "register" ? "auth__tab--active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Đăng ký
          </button>
          <button
            className={`auth__tab ${activeTab === "forgot" ? "auth__tab--active" : ""}`}
            onClick={() => setActiveTab("forgot")}
          >
            Quên MK
          </button>
        </div>

        <div className="auth__content">
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="auth__form">
              <div className="auth__field">
                <label className="auth__label">Email</label>
                <div className="auth__input-wrapper">
                  <Mail className="auth__input-icon" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="auth__input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="auth__field">
                <label className="auth__label">Mật khẩu</label>
                <div className="auth__input-wrapper">
                  <Lock className="auth__input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="auth__input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="auth__password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="auth__submit" disabled={isLoading}>
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>
          )}

          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="auth__form">
              <div className="auth__field">
                <label className="auth__label">Họ và tên</label>
                <div className="auth__input-wrapper">
                  <User className="auth__input-icon" />
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="auth__input"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="auth__field">
                <label className="auth__label">Email</label>
                <div className="auth__input-wrapper">
                  <Mail className="auth__input-icon" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="auth__input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="auth__field">
                <label className="auth__label">Mật khẩu</label>
                <div className="auth__input-wrapper">
                  <Lock className="auth__input-icon" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="auth__input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="auth__field">
                <label className="auth__label">Xác nhận mật khẩu</label>
                <div className="auth__input-wrapper">
                  <Lock className="auth__input-icon" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="auth__input"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="auth__submit" disabled={isLoading}>
                {isLoading ? "Đang đăng ký..." : "Đăng ký"}
              </button>
            </form>
          )}

          {activeTab === "forgot" && (
            <form onSubmit={handleForgotPassword} className="auth__form">
              <div className="auth__field">
                <label className="auth__label">Email</label>
                <div className="auth__input-wrapper">
                  <Mail className="auth__input-icon" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="auth__input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="auth__submit">
                Gửi link đặt lại mật khẩu
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
