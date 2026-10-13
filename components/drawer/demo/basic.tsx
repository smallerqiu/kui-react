import { useState } from "react";
import { Button, Space, Drawer } from "react-kui";
const Body = () => (
  <>
    <p>something ...</p>
    <p>something ...</p>
    <p>something ...</p>
  </>
);
export default function App() {
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
      {/* 开合状态只从 `onOpenChange` 回写：点「取消」不走 `onClose`，
          只挂 `onClose` 的话取消关掉的那次状态还停在 true，再点按钮就打不开了。 */}
      <Drawer open={show} footer={false} onOpenChange={setShow}>
        <Body />
      </Drawer>
      <Drawer
        open={show2}
        width="30%"
        title="Width 30%"
        onOpenChange={setShow2}
        onOk={() => setShow2(false)}
      >
        <Body />
      </Drawer>
      <Drawer
        open={show3}
        title="Click mask to close"
        maskClosable={false}
        onOpenChange={setShow3}
        onOk={() => setShow3(false)}
      >
        <Body />
      </Drawer>
      <Drawer
        open={show4}
        title="No mask"
        mask={false}
        onOpenChange={setShow4}
        onOk={submit}
        loading={loading}
      >
        <Body />
      </Drawer>
    </div>
  );
}
