import { Bell } from "kui-icons";
import { useState } from "react";
import { Button, ButtonGroup, Divider, Icon, Space, KSwitch as Switch, Badge } from "react-kui";
export default function Dynamic() {
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(5);
  return (
    <>
      <Space>
        <Badge dot={show}>
          <div className="badge-box" />
        </Badge>
        <Badge dot={show}>
          <Icon type={Bell} />
        </Badge>
        <Badge dot={show}>
          <a href="#">Link</a>
        </Badge>
        <Switch checked={show} onChange={(value) => setShow(Boolean(value))} />
      </Space>
      <Divider />
      <Space size={20}>
        <Badge count={count} maxCount={20}>
          <div className="badge-box" />
        </Badge>
        <ButtonGroup>
          <Button onClick={() => setCount((value) => Math.max(0, value - 1))}>-</Button>
          <Button onClick={() => setCount((value) => value + 1)}>+</Button>
        </ButtonGroup>
      </Space>
    </>
  );
}
