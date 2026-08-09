import { CircleUser, Images, Send } from "kui-icons";
import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Content,
  Footer,
  Header,
  Icon,
  Input,
  Layout,
  Menu,
  MenuItem,
  Sider,
  TextArea,
} from "react-kui";

const styles = `
.chat-container { height: 80vh; border: 1px solid var(--kui-color-border); border-radius: 8px; overflow: hidden; }
.chat-container .chat-sider { background: var(--kui-color-layout); border-right: 1px solid var(--kui-color-border); }
.chat-container .sider-header { padding: 10px; }
.chat-container .chat-header { background: var(--kui-color-bg-2); border-bottom: 1px solid var(--kui-color-border); padding: 10px 20px; }
.chat-container .chat-messages { padding: 24px; background: var(--kui-color-container); overflow-y: auto; }
.chat-container .msg-group { display: flex; gap: 12px; margin-bottom: 20px; }
.chat-container .msg-bubble { background: var(--kui-color-bg-component); padding: 8px 12px; border-radius: 4px 12px 12px 12px; }
.chat-container .msg-info { font-size: 12px; margin-bottom: 4px; color: #999; }
.chat-container .chat-input-box { background: var(--kui-color-bg-component); border-top: 1px solid var(--kui-color-border); padding: 12px 20px; }
.chat-container .toolbar { display: flex; gap: 16px; margin-bottom: 8px; color: #666; cursor: pointer; }
.chat-container .input-actions { display: flex; justify-content: flex-end; margin-top: 8px; }
`;

export default function App() {
  const [selectedKeys, setSelectedKeys] = useState(["c1"]);
  return (
    <>
      <style>{styles}</style>
      <Layout className="chat-container">
        <Sider className="chat-sider" style={{ width: 260 }}>
          <div className="sider-header">
            <Input placeholder="Search conversation..." />
          </div>
          <Menu
            mode="inline"
            value={selectedKeys}
            style={{ border: "none", padding: 10 }}
            onSelect={({ key }) => setSelectedKeys([key])}
          >
            <MenuItem menuKey="c1">
              # Core R&amp;D Team <Badge count={5} />
            </MenuItem>
            <MenuItem menuKey="c2"># Visual Design UI</MenuItem>
            <MenuItem menuKey="c3"># Customer Support (1-on-1)</MenuItem>
          </Menu>
        </Sider>

        <Layout>
          <Header className="chat-header">
            <div className="chat-title">
              # Core R&amp;D Team <small>(128 members)</small>
            </div>
          </Header>
          <Content className="chat-messages">
            {Array.from({ length: 20 }, (_, index) => (
              <div className="msg-group" key={index}>
                <Avatar size="small" />
                <div className="msg-bubble">
                  <div className="msg-info">
                    User_{index + 1} <span>10:30 AM</span>
                  </div>
                  <div className="msg-text">This is simulated historical message content.</div>
                </div>
              </div>
            ))}
          </Content>
          <Footer className="chat-input-box">
            <div className="toolbar">
              <Icon type={CircleUser} />
              <Icon type={Images} />
              <Icon type={Send} />
            </div>
            <TextArea rows={3} placeholder="Press Cmd + Enter to send the message..." />
            <div className="input-actions">
              <Button type="primary" size="small">
                Send
              </Button>
            </div>
          </Footer>
        </Layout>
      </Layout>
    </>
  );
}
