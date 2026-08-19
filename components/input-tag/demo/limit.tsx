import { InputTag } from "react-kui";
export default function App() {
  return (
    <InputTag
      max={5}
      maxTagCount={2}
      clearable
      defaultValue={["React", "TypeScript", "Vite", "Solid"]}
      placeholder="最多五个"
    />
  );
}
