import { useState } from "react";
import Space from "../../space";
import Page from "../index";

export default function SizerElevator() {
  const [page, setPage] = useState(3);
  const sizeData = [30, 50, 80, 100];
  const onChange = (nextPage: number) => setPage(nextPage);

  return (
    <Space vertical>
      <Page page={page} total={100} onChange={onChange} />
      <code>showSizer</code>
      <Page page={page} total={100} showSizer pageSize={20} onChange={onChange} />
      <code>showElevator</code>
      <Page
        page={page}
        total={100}
        showSizer
        showElevator
        pageSize={30}
        sizeData={sizeData}
        onChange={onChange}
      />
      <code>disabled</code>
      <Page
        page={page}
        total={100}
        disabled
        showSizer
        showElevator
        pageSize={30}
        sizeData={sizeData}
        onChange={onChange}
      />
    </Space>
  );
}
