import { useState } from "react";
import { Space, Page } from "react-kui";

export default function Size() {
  const [page, setPage] = useState(1);
  return (
    <Space vertical>
      <Page page={page} total={50} size="small" onChange={setPage} />
      <Page page={page} total={50} size="small" showSizer onChange={setPage} />
      <Page page={page} total={50} size="small" showElevator showSizer onChange={setPage} />
    </Space>
  );
}
