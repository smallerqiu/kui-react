import { Space, KSwitch as Switch } from "react-kui";
export default function Loading() {
  return (
    <Space vertical>
      <Switch loading checked />
      <Switch loading checked size="small" />
    </Space>
  );
}
