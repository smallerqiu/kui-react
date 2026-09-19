import { AutoComplete, type AutoCompleteOption } from "react-kui";
import { useState } from "react";

const options = ["Apple", "Apricot", "Banana", "Blueberry"];
const startsWith = (input: string, option: AutoCompleteOption) =>
  option.value.toLowerCase().startsWith(input.toLowerCase());

export default function App() {
  const [value, setValue] = useState("");
  return (
    <AutoComplete
      value={value}
      onChange={setValue}
      options={options}
      filterOption={startsWith}
      placeholder="Match names starting with only"
    />
  );
}
