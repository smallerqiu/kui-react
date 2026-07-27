import { Button } from "../../button";
import message from "../../message";
import Space from "../../space";
import Popconfirm from "../index";
const ok = () => message.success("Clicked on ok"),
  cancel = () => message.info("Clicked on cancel");
export default function Local() {
  return (
    <Space>
      <Popconfirm title="Are you sure delete this content?" onOk={ok} onCancel={cancel}>
        <Button type="danger">Delete</Button>
      </Popconfirm>
      <Popconfirm
        title="Are you sure delete this task?"
        okText="Yes"
        cancelText="No"
        onOk={ok}
        onCancel={cancel}
      >
        <Button type="primary">Confirm</Button>
      </Popconfirm>
    </Space>
  );
}
