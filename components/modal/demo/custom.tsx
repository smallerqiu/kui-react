import { Save } from "kui-icons";
import { useEffect, useRef, useState } from "react";
import { Button, Input, Space, Modal } from "react-kui";

export default function App() {
  const [open, setOpen] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const close = () => {
    setOpen(null);
    setLoading(false);
  };
  const submit = () => {
    setLoading(true);
    timer.current = setTimeout(() => {
      setLoading(false);
      setOpen(null);
    }, 2000);
  };
  // 开合状态只从 `onOpenChange` 回写：点「取消」不走 `onClose`，
  // 只挂 `onClose` 的话取消关掉的那次状态还停在原地，再点按钮就打不开了。
  const openChange = (id: number) => (next: boolean) => (next ? setOpen(id) : close());
  // 组件卸载时把还没跑完的异步保存停掉。
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <Space vertical>
      <Button onClick={() => setOpen(1)} type="primary">
        Width: 300px
      </Button>
      <Button onClick={() => setOpen(5)} type="primary">
        Width: 50%
      </Button>
      <Button onClick={() => setOpen(6)} type="primary">
        Width: calc(100% - 800px)
      </Button>
      <Button onClick={() => setOpen(2)} type="primary">
        Custom footer
      </Button>
      <Button onClick={() => setOpen(3)} type="primary">
        Internationalization
      </Button>
      <Button onClick={() => setOpen(4)} type="primary">
        Asynchronous shutdown
      </Button>
      <Modal
        title="Width 300px"
        open={open === 1}
        width={300}
        onOpenChange={openChange(1)}
        onOk={close}
      >
        <p>content</p>
      </Modal>
      <Modal
        title="Width 50%"
        open={open === 5}
        width="50%"
        onOpenChange={openChange(5)}
        onOk={close}
      >
        <p>content</p>
      </Modal>
      <Modal
        title="calc(100% - 800px)"
        open={open === 6}
        width="calc(100% - 800px)"
        onOpenChange={openChange(6)}
        onOk={close}
      >
        <p>content</p>
      </Modal>
      <Modal
        title="Custom footer"
        open={open === 2}
        onOpenChange={openChange(2)}
        footer={
          <Button icon={Save} onClick={close} type="primary">
            Save
          </Button>
        }
      >
        <p>content</p>
      </Modal>
      <Modal
        title="Are you ok ?"
        open={open === 3}
        okText="Ok"
        cancelText="Cancel"
        onOpenChange={openChange(3)}
        onOk={close}
      >
        <p>Yes, I'm fine!</p>
      </Modal>
      <Modal
        title="Submit forms"
        open={open === 4}
        loading={loading}
        onOpenChange={openChange(4)}
        onOk={submit}
      >
        <p>
          Name: <Input placeholder="Please input your name" style={{ width: 200 }} />
        </p>
      </Modal>
    </Space>
  );
}
