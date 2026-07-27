import { message, Space, Input, TextArea } from "react-kui";
const fire = (type: string) => (event: unknown) => {
  message.info(type);
  console.log(type, event);
};
const keyboard = {
  onKeyPress: fire("keypress"),
  onKeyUp: fire("keyup"),
  onKeyDown: (e: React.KeyboardEvent) => {
    fire("keydown")(e);
    if (e.key === "Enter") fire("keydownEnter")(e);
  },
  onBlur: fire("blur"),
  onFocus: fire("focus"),
};
export default function Event() {
  return (
    <Space vertical block>
      <Input placeholder="Please input" clearable onChange={fire("change")} {...keyboard} />
      <TextArea placeholder="Please input" onChange={fire("change")} {...keyboard} />
    </Space>
  );
}
