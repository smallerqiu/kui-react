import { useState } from "react";
import { Space, Page } from "react-kui";

export default function App() {
  const [page, setPage] = useState(1);
  return (
    <Space vertical>
      <Page page={page} total={50} onChange={setPage} />
      <Page page={page} total={50} size="small" showSizer onChange={setPage} />
      <Page page={page} total={50} size="large" showElevator showSizer onChange={setPage} />
    </Space>
  );
}
