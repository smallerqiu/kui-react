import Space from "../../space";
import Badge, { type BadgeStatusType } from "../index";
const statuses: BadgeStatusType[] = ["success", "error", "default", "warning"];
export default function Status() {
  return (
    <>
      <Space>
        {statuses.map((status) => (
          <Badge key={status} status={status} />
        ))}
      </Space>
      <br />
      <Space vertical>
        {statuses.map((status) => (
          <Badge key={status} status={status} text={status[0].toUpperCase() + status.slice(1)} />
        ))}
      </Space>
    </>
  );
}
