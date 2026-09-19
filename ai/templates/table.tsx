import { useEffect, useState } from "react";
import { Button, Input, Page, Space, Table, type Column } from "react-kui";

type Row = { id: number; name: string };
const allRows: Row[] = Array.from({ length: 47 }, (_, index) => ({
  id: index + 1,
  name: `用户 ${index + 1}`,
}));
const columns: Column<Row>[] = [
  { title: "编号", key: "id" },
  { title: "姓名", key: "name" },
];

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [request, setRequest] = useState({ query: "", page: 1, pageSize: 10, revision: 0 });
  const [result, setResult] = useState({ data: [] as Row[], total: 0, loading: true, error: "" });
  useEffect(() => {
    let canceled = false;
    async function load() {
      await Promise.resolve();
      if (canceled) return;
      setResult((previous) => ({ ...previous, loading: true, error: "" }));
      try {
        // Replace this local mock with an API returning { data, total }.
        await new Promise((resolve) => setTimeout(resolve, 200));
        const rows = allRows.filter((row) => row.name.includes(request.query));
        if (!canceled)
          setResult({
            data: rows.slice(
              (request.page - 1) * request.pageSize,
              request.page * request.pageSize,
            ),
            total: rows.length,
            loading: false,
            error: "",
          });
      } catch {
        if (!canceled)
          setResult((previous) => ({ ...previous, loading: false, error: "加载失败，请重试" }));
      }
    }
    void load();
    return () => {
      canceled = true;
    };
  }, [request]);
  return (
    <Space vertical block>
      <Space>
        <Input value={keyword} onChange={setKeyword} placeholder="搜索姓名" />
        <Button
          type="primary"
          onClick={() =>
            setRequest((previous) => ({
              ...previous,
              query: keyword.trim(),
              page: 1,
              revision: previous.revision + 1,
            }))
          }
        >
          搜索
        </Button>
        <Button
          disabled={result.loading}
          onClick={() =>
            setRequest((previous) => ({ ...previous, revision: previous.revision + 1 }))
          }
        >
          刷新
        </Button>
      </Space>
      {result.error && <p role="alert">{result.error}</p>}
      <Table<Row> rowKey="id" columns={columns} data={result.data} loading={result.loading} />
      <Page
        page={request.page}
        pageSize={request.pageSize}
        total={result.total}
        showSizer
        onChange={(page, pageSize) => setRequest((previous) => ({ ...previous, page, pageSize }))}
      />
    </Space>
  );
}
