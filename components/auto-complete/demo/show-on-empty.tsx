import { AutoComplete } from "react-kui";
export default function App() {
  return (
    <AutoComplete showOnEmpty options={["Vue", "React", "Angular"]} placeholder="Please input" />
  );
}
