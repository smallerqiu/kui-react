import { House, Key, LogoKui, PanelLeftClose, PanelLeftOpen, Settings, User } from "kui-icons";
import { useState } from "react";
import {
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Content,
  Divider,
  Footer,
  Header,
  Icon,
  Input,
  Layout,
  Menu,
  Sider,
  Space,
} from "react-kui";

const styles = `
.admin-wrapper { min-height: 100vh; border: 1px solid var(--kui-color-border); }
.admin-wrapper .admin-menu { border: none; }
.admin-wrapper .admin-logo { height: 64px; display: flex; align-items: center; padding: 0 24px; font-size: 18px; font-weight: 600; gap: 12px; }
.admin-wrapper .admin-header { background: var(--kui-color-bg-1); padding: 10px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08); z-index: 10; }
.admin-wrapper .header-left { display: flex; align-items: center; gap: 16px; }
.admin-wrapper .admin-content-area { background: var(--kui-color-bg-layout); padding: 24px; }
.admin-wrapper .content-wrapper { max-width: 1200px; margin: 0 auto; }
.admin-wrapper .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.admin-wrapper .data-card { background: var(--kui-color-bg-container); padding: 24px; border-radius: 8px; min-height: 400px; }
.admin-wrapper .skeleton-table { height: 40px; background: var(--kui-color-bg-component); margin-bottom: 12px; border-radius: 4px; }
`;

const items = [
  { key: "t1", icon: House, title: "Dashboard" },
  {
    key: "t2",
    icon: User,
    title: "User Management",
    children: [
      { key: "t2-1", title: "User List" },
      { key: "t2-2", title: "Role List" },
    ],
  },
  {
    key: "t3",
    icon: Settings,
    title: "System Settings",
    children: [
      { key: "t3-1", title: "Permission configuration" },
      { key: "t3-2", title: "Logs" },
    ],
  },
  { key: "t4", icon: Key, title: "Api Keys" },
];

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(["t2-1"]);
  const [openKeys, setOpenKeys] = useState(["t2", "t3"]);

  return (
    <>
      <style>{styles}</style>
      <Layout className="admin-wrapper">
        <Sider
          collapsed={collapsed}
          collapsible
          className="admin-sider"
          style={{ width: collapsed ? 80 : 200 }}
        >
          <div className="admin-logo">
            <Icon type={LogoKui} />
            {!collapsed && <span>KUI Console</span>}
          </div>
          <Menu
            value={selectedKeys}
            openKeys={openKeys}
            mode="inline"
            items={items}
            className="admin-menu"
            inlineCollapsed={collapsed}
            onSelect={({ key }) => setSelectedKeys([key])}
            onOpenChange={setOpenKeys}
          />
        </Sider>

        <Layout>
          <Header className="admin-header">
            <div className="header-left">
              <Button
                type="text"
                block
                onClick={() => setCollapsed((value) => !value)}
                icon={collapsed ? PanelLeftOpen : PanelLeftClose}
              />
              <Breadcrumb>
                <BreadcrumbItem>Home</BreadcrumbItem>
                <BreadcrumbItem>User Management</BreadcrumbItem>
                <BreadcrumbItem>User List</BreadcrumbItem>
              </Breadcrumb>
            </div>
            <Space className="header-right">
              <Input placeholder="搜索功能..." style={{ width: 200 }} />
              <Divider type="vertical" />
              <Avatar icon={User} size={25} />
              <span className="user-name">Admin</span>
            </Space>
          </Header>

          <Content className="admin-content-area">
            <div className="content-wrapper">
              <div className="page-header">
                <h2>User List</h2>
                <Button type="primary">Add User</Button>
              </div>
              <div className="data-card">
                {Array.from({ length: 5 }, (_, index) => (
                  <div className="skeleton-table" key={index} />
                ))}
              </div>
            </div>
          </Content>

          <Footer className="admin-footer">
            KUI Design Platform ©2026 Crafted with ❤️ for Developers
          </Footer>
        </Layout>
      </Layout>
    </>
  );
}
