import React, { useState } from 'react';
import { Layout, Menu, Card, Row, Col, Progress, Button } from 'antd';
import {
  HomeOutlined, DollarOutlined, RobotOutlined, BarChartOutlined,
  WalletOutlined, FundOutlined, LineChartOutlined, UserOutlined, LogoutOutlined
} from '@ant-design/icons';
import './Home.scss';

const { Sider, Content } = Layout;

const menuItems = [
  { key: 'dashboard', icon: <HomeOutlined />, label: 'Dashboard' },
  { key: 'spending', icon: <DollarOutlined />, label: 'Thu Chi' },
  { key: 'ai', icon: <RobotOutlined />, label: 'AI Tư vấn' },
  { key: 'budget', icon: <BarChartOutlined />, label: 'Ngân sách' },
  { key: 'debt', icon: <WalletOutlined />, label: 'Quản lý nợ' },
  { key: 'saving', icon: <FundOutlined />, label: 'Tiết kiệm & Đầu tư' },
  { key: 'report', icon: <LineChartOutlined />, label: 'Báo cáo' },
];

const budgetData = [
  { name: 'Ăn uống', used: 3500000, total: 4000000 },
  { name: 'Giao thông', used: 1200000, total: 1500000 },
  { name: 'Giải trí', used: 800000, total: 1000000 },
  { name: 'Mua sắm', used: 2000000, total: 3000000 },
];

const goalData = [
  { name: 'Mua xe máy mới', current: 45000000, target: 60000000 },
  { name: 'Quỹ khẩn cấp', current: 25000000, target: 50000000 },
  { name: 'Du lịch Nhật Bản', current: 8000000, target: 30000000 },
];

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="dashboard-layout">
      <Sider
        width={250}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="dashboard-sider"
      >
        <div className="logo">
          <span role="img" aria-label="logo" className="logo-icon">🤖</span>
          {!collapsed && <span className="logo-text">SmartFinance</span>}
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          style={{ borderRight: 0, marginTop: 16 }}
        >
          {menuItems.map(item => (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
        <div className="user-info">
          <UserOutlined style={{ fontSize: 24, marginRight: 8 }} />
          <span>User</span>
          <Button type="text" icon={<LogoutOutlined />} style={{ marginLeft: 'auto' }} />
        </div>
      </Sider>
      <Layout>
        <Content className="dashboard-content">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <div className="stat-title">Tổng thu nhập tháng này</div>
                <div className="stat-value green">25,000,000 đ</div>
                <div className="stat-desc green">+12% so với tháng trước</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <div className="stat-title">Tổng chi tiêu tháng này</div>
                <div className="stat-value red">18,500,000 đ</div>
                <div className="stat-desc red">+8% so với tháng trước</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <div className="stat-title">Tiết kiệm tháng này</div>
                <div className="stat-value blue">6,500,000 đ</div>
                <div className="stat-desc blue">+15% so với tháng trước</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <div className="stat-title">Tổng nợ hiện tại</div>
                <div className="stat-value orange">12,000,000 đ</div>
                <div className="stat-desc orange">-5% so với tháng trước</div>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} md={12}>
              <Card>
                <div className="section-title">🧭 Tiến độ ngân sách tháng này</div>
                <div className="section-desc">Theo dõi chi tiêu theo từng danh mục</div>
                {budgetData.map(item => (
                  <div key={item.name} className="progress-row">
                    <div className="progress-label">
                      {item.name}
                      <span className="progress-amount">
                        {item.used.toLocaleString()} / {item.total.toLocaleString()} đ
                      </span>
                    </div>
                    <Progress
                      percent={Math.round((item.used / item.total) * 100)}
                      showInfo={false}
                      strokeColor="#222"
                      trailColor="#eee"
                    />
                    <div className="progress-percent">
                      {((item.used / item.total) * 100).toFixed(1)}% đã sử dụng
                    </div>
                  </div>
                ))}
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card>
                <div className="section-title">Mục tiêu tài chính</div>
                <div className="section-desc">Tiến độ đạt được các mục tiêu đã đặt ra</div>
                {goalData.map(item => (
                  <div key={item.name} className="progress-row">
                    <div className="progress-label">
                      {item.name}
                      <span className="progress-amount">
                        {item.current.toLocaleString()} / {item.target.toLocaleString()} đ
                      </span>
                    </div>
                    <Progress
                      percent={Math.round((item.current / item.target) * 100)}
                      showInfo={false}
                      strokeColor="#222"
                      trailColor="#eee"
                    />
                    <div className="progress-percent">
                      {((item.current / item.target) * 100).toFixed(1)}% hoàn thành
                    </div>
                  </div>
                ))}
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
