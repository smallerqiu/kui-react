import { useState } from "react";
import { Page, Transfer } from "react-kui";
const items = Array.from({ length: 23 }, (_, index) => ({
  key: index + 1,
  title: `Member ${index + 1}`,
}));
export default function App() {
  const [selected, setSelected] = useState<(string | number)[]>([2]);
  const [page, setPage] = useState(1);
  const source = items.filter((item) => !selected.includes(item.key));
  const visible = [
    ...source.slice((page - 1) * 5, page * 5),
    ...items.filter((item) => selected.includes(item.key)),
  ];
  return (
    <Transfer
      targetKeys={selected}
      onChange={(event) => setSelected(event.targetKeys)}
      dataSource={visible}
      titles={["All members", "Selected"]}
      footer={(direction) =>
        direction === "left" ? (
          <Page
            simple
            page={page}
            onChange={(next) => setPage(next)}
            total={source.length}
            pageSize={5}
          />
        ) : (
          `已选择 ${selected.length} 项`
        )
      }
    />
  );
}
