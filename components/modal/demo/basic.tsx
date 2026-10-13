import { useState } from "react";
import { Button, Space, Modal } from "react-kui";

export default function App() {
  const [visible, setVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  return (
    <Space vertical>
      <Button onClick={() => setVisible(true)} type="primary">
        Open
      </Button>
      <Button onClick={() => setOverlayVisible(true)} type="primary">
        Click the overlay to close
      </Button>
      {/* 开合状态只从 `onOpenChange` 回写：点「取消」不走 `onClose`，
          只挂 `onClose` 的话取消关掉的那次状态还停在 true，再点按钮就打不开了。 */}
      <Modal
        title="Basic Modal"
        open={visible}
        onOpenChange={setVisible}
        onOk={() => setVisible(false)}
      >
        <p>This is the content of a basic modal.</p>
        <p>More content...</p>
      </Modal>
      <Modal
        title="Basic Modal"
        open={overlayVisible}
        maskClosable
        onOpenChange={setOverlayVisible}
        onOk={() => setOverlayVisible(false)}
      >
        <p>This is the content of a basic modal.</p>
        <p>More content...</p>
      </Modal>
    </Space>
  );
}
