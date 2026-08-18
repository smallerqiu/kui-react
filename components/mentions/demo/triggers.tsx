import { Mentions } from "react-kui";
export default function App() {
  return (
    <Mentions
      triggers={["@", "#"]}
      options={["小北", "React", "TypeScript"]}
      placeholder="输入 @ 或 #"
    />
  );
}
