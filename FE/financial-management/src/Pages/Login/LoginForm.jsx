"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Brain, Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import "./LoginForm.scss"

export default function LoginForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  })
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      })
      // Lưu thông tin user vào localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user))
      localStorage.setItem('isLoggedIn', 'true')
      navigate("/home")
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại!")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp!")
      setIsLoading(false)
      return
    }
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        ho_va_ten: formData.fullName,
        email: formData.email,
        password: formData.password,
        // Có thể bổ sung ngày sinh, thu_nhap_hang_thang nếu muốn
      })
      setActiveTab("login")
      setError("Đăng ký thành công! Vui lòng đăng nhập.")
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại!")
    } finally {
      setIsLoading(false)
    }
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
              {error && <div style={{color: 'red', fontSize: '0.98rem'}}>{error}</div>}
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
