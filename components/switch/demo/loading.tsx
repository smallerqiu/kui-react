import Space from "../../space";
import Switch from "../index";
export default function Loading() {
  return (
    <Space vertical>
      <Switch loading checked />
      <Switch loading checked size="small" />
    </Space>
  );
}
