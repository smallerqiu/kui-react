import { CircleQuestionMark, Gift, Search, User } from "kui-icons";
import { useEffect, useRef, useState } from "react";
import { Button, Icon, message, Select, Space, Tag, Tooltip, TreeSelect, Input } from "react-kui";
const protocols = [
    { label: "http", value: "http" },
    { label: "https", value: "https" },
  ],
  domains = [
    { label: ".com", value: ".com" },
    { label: ".cn", value: ".cn" },
    { label: ".org", value: ".org" },
  ],
  treeData = [
    {
      title: "fruit",
      key: "1",
      children: [
        { title: "apple", key: "11" },
        { title: "orange", key: "12" },
      ],
    },
  ];
export default function App() {
  const [time, setTime] = useState(60);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    []
  );
  const send = () => {
    if (timer.current) clearInterval(timer.current);
    setTime(59);
    message.success("Verification code sent successfully");
    timer.current = setInterval(
      () =>
        setTime((v) => {
          if (v <= 1) {
            if (timer.current) clearInterval(timer.current);
            return 60;
          }
          return v - 1;
        }),
      1000
    );
  };
  return (
    <Space vertical block>
      <Input placeholder="Please input username" icon={User} />
      <Input
        placeholder="Please input the captcha"
        maxLength={8}
        prefix={<Icon type={Search} />}
        suffix={<Tag theme="outline">⌘K</Tag>}
      />
      <Input
        placeholder="Please input the captcha"
        maxLength={8}
        suffix={
          <Button disabled={time < 60} onClick={send}>
            {time === 60 ? "Get verification code" : `${time}(s)`}
          </Button>
        }
      />
      <Input
        placeholder="Please input"
        icon={Gift}
        suffix={
          <Tooltip title="Please contact the administrator">
            <Button icon={CircleQuestionMark} />
          </Tooltip>
        }
      />
      <Input placeholder="Please enter the amount" suffix="RMB" prefix="¥" />
      <Input placeholder="Please enter the domain" suffix=".com" prefix="https://" />
      <Input
        placeholder="Please input"
        prefix={<Select options={protocols} clearable value="http" />}
        suffix={<Select options={domains} clearable value=".com" />}
      />
      <Input placeholder="Please input" suffix=".00" />
      <Input
        placeholder="Please input"
        prefix={<Select options={protocols} clearable value="http" />}
        suffix={<TreeSelect treeData={treeData} clearable style={{ width: 100 }} />}
      />
    </Space>
  );
}
