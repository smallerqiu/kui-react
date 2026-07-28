import { useState } from "react";
import { message, Space, Page } from "react-kui";

export default function App() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const onChange = (nextPage: number, nextPageSize: number) => {
    setPage(nextPage);
    setPageSize(nextPageSize);
    message.info(`当前页: ${nextPage}, 每页: ${nextPageSize}`);
  };

  return (
    <Space vertical>
      <Page page={page} pageSize={pageSize} total={50} onChange={onChange} />
      <Page page={page} pageSize={pageSize} total={50} onChange={onChange} disabled />
    </Space>
  );
}
