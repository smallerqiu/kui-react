import { useState } from "react";
import { Page, Space } from "react-kui";

export default function App() {
  const [page, setPage] = useState(2);
  return (
    <Space vertical>
      <Page page={page} onChange={(nextPage) => setPage(nextPage)} total={80} pageSize={10} />
      <Page
        page={page}
        onChange={(nextPage) => setPage(nextPage)}
        showElevator
        total={1000}
        pageSize={10}
      />
      <Page
        page={page}
        onChange={(nextPage) => setPage(nextPage)}
        size="small"
        theme="outline"
        total={80}
        pageSize={10}
      />
      <Page page={3} simple disabled total={80} pageSize={10} />
    </Space>
  );
}
