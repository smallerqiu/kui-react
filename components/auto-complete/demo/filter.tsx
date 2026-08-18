import { AutoComplete } from "react-kui";
export default function App() {
  return (
    <AutoComplete
      options={["React", "React Native", "Preact", "Vue"]}
      filterOption={(input, option) => option.value.toLowerCase().startsWith(input.toLowerCase())}
      placeholder="仅匹配开头"
    />
  );
}
