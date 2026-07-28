import { Button, Space, Poptip } from "react-kui";

const content = (
  <>
    <p>See the light through the mist!</p>
    <p>See the light through the mist!</p>
  </>
);
export default function App() {
  return (
    <Space>
      <Poptip title="Title" content={content}>
        <Button type="primary">Hover me</Button>
      </Poptip>
      <Poptip title="Title" trigger="focus" content={content}>
        <Button type="primary">Focus</Button>
      </Poptip>
      <Poptip title="Title" trigger="click" content={content}>
        <Button type="primary">Click me</Button>
      </Poptip>
    </Space>
  );
}
