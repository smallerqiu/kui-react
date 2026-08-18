import { AutoComplete } from "react-kui";
export default function App() {
  return (
    <AutoComplete showOnEmpty options={["React", "Vue", "Solid"]} placeholder="空输入聚焦时展示" />
  );
}
