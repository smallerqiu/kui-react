import { Button, message, Space, modal } from "react-kui";

const confirm = () =>
  modal.confirm({
    title: "Are you sure to do this?",
    content: "This operation is irreversible, proceed with caution!!!",
    onOk: () => {
      message.success("you clicked ok");
    },
    onCancel: () => {
      message.info("you clicked cancel");
    },
  });
const custom = () =>
  modal.confirm({
    title: "Are you Ok?",
    content: "Yes , I am fine, and you?",
    okText: "OK",
    cancelText: "Cancel",
  });
const asyncConfirm = () =>
  modal.confirm({
    title: "Are you sure to do this?",
    content: "This operation is irreversible, proceed with caution!!!",
    onOk: () => new Promise<void>((resolve) => setTimeout(resolve, 2000)),
  });
const closeAll = () => {
  for (let index = 0; index < 3; index += 1)
    setTimeout(
      () =>
        modal.confirm({
          title: "Destroy All",
          content: "A surprise of the universe",
          cancelText: "Close all",
          onCancel: modal.destroyAll,
          onOk: () => new Promise<void>((resolve) => setTimeout(resolve, 2000)),
        }),
      index * 500
    );
};
export default function Confirm() {
  return (
    <Space vertical>
      <Button onClick={confirm}>Confirm</Button>
      <Button onClick={custom}>Internationalization</Button>
      <Button onClick={asyncConfirm}>Asynchronous shutdown</Button>
      <Button onClick={closeAll}>Close All</Button>
    </Space>
  );
}
