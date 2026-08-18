import { Mentions } from "react-kui";
export default function App() {
  return (
    <Mentions
      placeholder="输入 @ 提及成员"
      options={[{ value: "小北" }, { value: "设计团队" }, { value: "开发团队" }]}
    />
  );
}
