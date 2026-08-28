import { useState } from "react";
import { Transfer } from "react-kui";
const items = ["Design", "Development", "Testing", "Deployment"].map((title, key) => ({
  key: key + 1,
  title,
}));
export default function App() {
  const [selected, setSelected] = useState<(string | number)[]>([4]);
  const [log, setLog] = useState("请选择并移动项目");
  return (
    <>
      <Transfer
        targetKeys={selected}
        onChange={(event) => {
          setSelected(event.targetKeys);
          setLog(`${event.direction === "right" ? "加入" : "移除"}：${event.movedKeys.join(", ")}`);
        }}
        onSelectChange={(source, target) =>
          setLog(`左侧已选 ${source.length} 项，右侧已选 ${target.length} 项`)
        }
        dataSource={items}
        operations={["加入", "移除"]}
      />
      <p>{log}</p>
    </>
  );
}
