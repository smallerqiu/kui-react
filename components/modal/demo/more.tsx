import { useState } from "react";
import { Button, Space, Modal } from "react-kui";

const text = `A long time ago, In a beautiful kingdom,
there lived a young king and queen,
the people loved them so much;`;
export default function App() {
  const [open, setOpen] = useState<number | null>(null);
  const close = () => setOpen(null);
  return (
    <Space vertical>
      <Button onClick={() => setOpen(1)} type="primary">
        Draggable
      </Button>
      <Button onClick={() => setOpen(2)} type="primary">
        Center-aligned
      </Button>
      <Button onClick={() => setOpen(3)} type="primary">
        Top 200px
      </Button>
      <Button onClick={() => setOpen(4)} type="primary">
        Maximize
      </Button>
      <Button onClick={() => setOpen(5)} type="primary">
        No overlay
      </Button>
      <Button onClick={() => setOpen(6)} type="primary">
        No footer
      </Button>
      <Modal
        title="Draggable"
        open={open === 1}
        width="50%"
        draggable
        onClose={close}
        onCancel={close}
        onOk={close}
      >
        {text}
      </Modal>
      <Modal
        title="Centered"
        open={open === 2}
        centered
        onClose={close}
        onCancel={close}
        onOk={close}
      >
        {text}
      </Modal>
      <Modal
        title="Top 200px"
        open={open === 3}
        top={200}
        onClose={close}
        onCancel={close}
        onOk={close}
      >
        {text}
      </Modal>
      <Modal
        title="Maximized"
        open={open === 4}
        maximized
        onClose={close}
        onCancel={close}
        onOk={close}
      >
        {text}
      </Modal>
      <Modal
        title="Click mask dont't be close"
        open={open === 5}
        mask={false}
        maskClosable={false}
        onClose={close}
        onCancel={close}
        onOk={close}
      >
        {text}
      </Modal>
      <Modal
        title="No footer"
        open={open === 6}
        footer={false}
        onClose={close}
        onCancel={close}
        onOk={close}
      >
        {text}
      </Modal>
    </Space>
  );
}
