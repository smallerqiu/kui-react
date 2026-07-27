import Space from "../../space";
import { TextArea } from "../index";
export default function Textarea() {
  return (
    <Space vertical block>
      <TextArea rows={4} placeholder="Please input" />
      <TextArea rows={2} placeholder="Please input" />
      <TextArea rows={2} placeholder="Disabled" disabled />
      <TextArea rows={2} placeholder="Readonly" readOnly />
    </Space>
  );
}
