import { useState } from "react";
import { Button, Modal, Space } from "react-kui";

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
