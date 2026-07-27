import { Save } from "kui-icons";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../button";
import Input from "../../input";
import Space from "../../space";
import Modal from "../index";

export default function Custom() {
  const [open, setOpen] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const close = () => {
    setOpen(null);
    setLoading(false);
    if (timer.current) clearTimeout(timer.current);
  };
  const submit = () => {
    setLoading(true);
    timer.current = setTimeout(() => {
      setLoading(false);
      setOpen(null);
    }, 2000);
  };
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
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
        onClose={close}
        onCancel={close}
        onOk={close}
      >
        <p>content</p>
      </Modal>
      <Modal
        title="Width 50%"
        open={open === 5}
        width="50%"
        onClose={close}
        onCancel={close}
        onOk={close}
      >
        <p>content</p>
      </Modal>
      <Modal
        title="calc(100% - 800px)"
        open={open === 6}
        width="calc(100% - 800px)"
        onClose={close}
        onCancel={close}
        onOk={close}
      >
        <p>content</p>
      </Modal>
      <Modal
        title="Custom footer"
        open={open === 2}
        onClose={close}
        footerSlot={
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
        onClose={close}
        onCancel={close}
        onOk={close}
      >
        <p>Yes, I'm fine!</p>
      </Modal>
      <Modal
        title="Submit forms"
        open={open === 4}
        loading={loading}
        onClose={close}
        onCancel={close}
        onOk={submit}
      >
        <p>
          Name: <Input placeholder="Please input your name" style={{ width: 200 }} />
        </p>
      </Modal>
    </Space>
  );
}
