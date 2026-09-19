import { Button, Space, loading } from "react-kui";
export default function App() {
  return (
    <Space wrap>
      <Button onClick={() => loading.start()}>start</Button>
      <Button onClick={loading.finish}>finish</Button>
      <Button onClick={loading.error}>error</Button>
      <Button onClick={() => loading.update(30)}>update 30%</Button>
      <Button onClick={() => loading.update(80)}>update 80%</Button>
      <Button onClick={loading.destroy}>destroy</Button>
    </Space>
  );
}
