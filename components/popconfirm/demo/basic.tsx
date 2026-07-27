import message from "../../message";
import Popconfirm from "../index";
export default function Basic() {
  return (
    <Popconfirm
      title="Are you sure delete this task?"
      onOk={() => message.success("Clicked on ok")}
      onCancel={() => message.info("Clicked on cancel")}
    >
      <a>Delete</a>
    </Popconfirm>
  );
}
