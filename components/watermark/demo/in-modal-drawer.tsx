import { useState } from "react";
import { Button, Drawer, Flex, Modal, Space, Watermark } from "react-kui";
const content = ["审批专用", "张三 2026-07-10", "IP: 192.168.1.100"],
  body = (
    <Flex style={{ backgroundColor: "#f5f5f510", height: 500 }} align="center" justify="center">
      <p>核心敏感数据</p>
    </Flex>
  );
export default function App() {
  const [modal, setModal] = useState(false),
    [drawer, setDrawer] = useState(false);
  return (
    <>
      <Modal
        open={modal}
        title="涉密核心资产审批"
        onClose={() => setModal(false)}
        onCancel={() => setModal(false)}
      >
        <Watermark content={content}>{body}</Watermark>
      </Modal>
      <Drawer
        open={drawer}
        title="涉密核心资产审批"
        onClose={() => setDrawer(false)}
        onCancel={() => setDrawer(false)}
      >
        <Watermark content={content}>{body}</Watermark>
      </Drawer>
      <Space>
        <Button onClick={() => setModal(true)}>Show in Modal</Button>
        <Button onClick={() => setDrawer(true)}>Show in Drawer</Button>
      </Space>
    </>
  );
}
