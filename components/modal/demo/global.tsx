import { Moon } from "kui-icons";
import { Button, message, Space, modal } from "react-kui";

const success = () =>
  modal.success({
    title: "Successfully Done",
    content: "Congratulations on your successful operation!",
    onOk: () => {
      message.info("success");
    },
  });
const error = () =>
  modal.error({
    title: "Failed",
    content: "Sorry, operation failed！",
    onOk: () => {
      message.info("error");
    },
  });
const warning = () =>
  modal.warning({
    title: "Warning",
    content: "This is a warning message.",
    onOk: () => {
      message.info("warning");
    },
  });
const info = () =>
  modal.info({
    title: "Alert",
    content: "You opened a modal.",
    onOk: () => {
      message.info("info");
    },
  });
const show = () =>
  modal.show({
    title: "I am a modal",
    content: "See the light through the mist.",
    icon: Moon,
    color: "#eccb23",
    onOk: () => {
      message.info("show");
    },
  });
export default function App() {
  return (
    <Space vertical>
      <Button onClick={success}>Success</Button>
      <Button onClick={error} type="danger">
        Error
      </Button>
      <Button onClick={warning}>Warning</Button>
      <Button onClick={info} type="primary">
        Info
      </Button>
      <Button onClick={show} icon={Moon}>
        Custom icon
      </Button>
    </Space>
  );
}
