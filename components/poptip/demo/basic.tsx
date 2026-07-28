import { Button, Space, Poptip } from "react-kui";

export default function App() {
  return (
    <Space>
      <Poptip title="Title" content={<p>See the light through the mist!</p>}>
        <Button type="primary">Hover me</Button>
      </Poptip>
      <Poptip
        dark
        content={
          <>
            <p>See the light through the mist!</p>
            <p>See the light through the mist!</p>
          </>
        }
      >
        <Button type="primary">No title</Button>
      </Poptip>
    </Space>
  );
}
