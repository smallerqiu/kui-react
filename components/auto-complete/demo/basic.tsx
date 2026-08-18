import { AutoComplete } from "react-kui";
export default function App() {
  return <AutoComplete placeholder="搜索框架" options={["React", "Vue", "Solid", "Svelte"]} />;
}
