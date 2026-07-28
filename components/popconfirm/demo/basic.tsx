import { message, Popconfirm } from "react-kui";
export default function App() {
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
