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
  const currentPage = Math.min(page, Math.ceil(source.length / 5) || 1);
  const visible = [
    ...source.slice((currentPage - 1) * 5, currentPage * 5),
    ...items.filter((item) => selected.includes(item.key)),
  ];
  return (
    <Transfer
      targetKeys={selected}
      onChange={(event) => setSelected(event.targetKeys)}
      dataSource={visible}
      titles={["全部成员", "已选择"]}
      footer={(direction) =>
        direction === "left" ? (
          <Page
            simple
            showElevator
            showTotal={false}
            size="small"
            page={currentPage}
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
