import Space from "../../space";
import Spin from "../index";
export default function Basic() {
  return (
    <Space>
      <Spin size="large" />
      <Spin />
      <Spin size="small" />
    </Space>
  );
}
