import { useState } from "react";
import { Button, Space, Drawer } from "react-kui";
const Body = () => (
  <>
    <p>something ...</p>
    <p>something ...</p>
    <p>something ...</p>
  </>
);
export default function Basic() {
  const [show, setShow] = useState(false),
    [show2, setShow2] = useState(false),
    [show3, setShow3] = useState(false),
    [show4, setShow4] = useState(false),
    [loading, setLoading] = useState(false);
  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      setShow4(false);
      setLoading(false);
    }, 2000);
  };
  return (
    <div>
      <Space wrap>
        <Button onClick={() => setShow((v) => !v)}>Open</Button>
        <Button onClick={() => setShow2((v) => !v)}>Width 30%</Button>
        <Button onClick={() => setShow3((v) => !v)}>Click mask can't close</Button>
        <Button onClick={() => setShow4((v) => !v)}>No mask</Button>
      </Space>
      <Drawer open={show} footer={false} onClose={() => setShow(false)}>
        <Body />
      </Drawer>
      <Drawer
        open={show2}
        width="30%"
        title="Width 30%"
        onClose={() => setShow2(false)}
        onOk={() => setShow2(false)}
      >
        <Body />
      </Drawer>
      <Drawer
        open={show3}
        title="Click mask to close"
        maskClosable={false}
        onClose={() => setShow3(false)}
        onOk={() => setShow3(false)}
      >
        <Body />
      </Drawer>
      <Drawer
        open={show4}
        title="No mask"
        mask={false}
        onClose={() => setShow4(false)}
        onOk={submit}
        loading={loading}
      >
        <Body />
      </Drawer>
    </div>
  );
}
