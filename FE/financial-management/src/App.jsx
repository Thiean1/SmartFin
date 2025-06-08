import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.scss'
import LoginForm from './Pages/Login/LoginForm'
import Register from './Pages/Register/Regis'
import Home from './Pages/Home/Home'
import Transaction from './components/Transaction/Transaction'
import Dashboard from './Pages/Home/Dashboard'
import AIAdvisor from './components/AIAdvisor/AIAdvisor'
import Budget from './components/Budget/Budget'
import Debt from './components/Debt/Debt'
import Saving from './components/Saving/Saving'
import Report from './components/Report/Report'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />}>
          <Route index element={<Dashboard />} />
          <Route path="spending" element={<Transaction />} />
          <Route path="ai" element={<AIAdvisor />} />
          <Route path="budget" element={<Budget />} />
          <Route path="debt" element={<Debt />} />
          <Route path="saving" element={<Saving />} />
          <Route path="report" element={<Report />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
