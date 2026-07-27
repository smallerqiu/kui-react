import { Lock, User } from "kui-icons";
import { useState } from "react";
import { Button, message, Space, Input } from "react-kui";
export default function WithIcon() {
  const [visible, setVisible] = useState(true);
  const search = (value: string) => {
    message.info("This is search event");
    console.log(value);
  };
  return (
    <Space vertical block>
      <Input placeholder="User Name..." icon={User} />
      <Input type="password" placeholder="Password..." icon={Lock} />
      <Input
        type="password"
        placeholder="Password no toggle"
        icon={Lock}
        visiblePasswordIcon={false}
      />
      <Space compact block>
        <Input
          type="password"
          placeholder="Password default text"
          icon={Lock}
          visiblePasswordIcon={visible}
        />
        <Button onClick={() => setVisible(!visible)}>Toggle</Button>
      </Space>
      <Input placeholder="Please input" clearable={false} onSearch={search} />
    </Space>
  );
}
