import Space from "../../space";
import Tag from "../index";
export default function Basic() {
  return (
    <Space wrap>
      <Tag theme="fill">标签1</Tag>
      <Tag theme="fill">标签2</Tag>
      <Tag theme="fill">标签3</Tag>
      <Tag closeable theme="fill">
        标签4
      </Tag>
    </Space>
  );
}
