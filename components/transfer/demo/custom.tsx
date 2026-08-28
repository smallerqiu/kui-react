import { useState } from "react";
import { Tag, Transfer } from "react-kui";
const roles: Record<string | number, string> = {
  1: "Design",
  2: "Frontend",
  3: "Backend",
  4: "QA",
};
const items = ["Ava", "Leo", "Mia", "Noah"].map((title, key) => ({ key: key + 1, title }));
export default function App() {
  const [selected, setSelected] = useState<(string | number)[]>([2]);
  return (
    <Transfer
      targetKeys={selected}
      onChange={(event) => setSelected(event.targetKeys)}
      searchable
      dataSource={items}
      filterOption={(keyword, item) =>
        `${item.title} ${roles[item.key]}`.toLowerCase().includes(keyword.toLowerCase())
      }
      item={(item) => (
        <>
          <strong>{item.title}</strong>
          <Tag size="small" theme="plain">
            {roles[item.key]}
          </Tag>
        </>
      )}
      footer={(direction) => (direction === "left" ? "可选择成员" : "当前项目成员")}
      titles={["候选成员", "已加入"]}
    />
  );
}
