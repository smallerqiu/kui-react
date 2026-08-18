import { Mentions } from "react-kui";
export default function App() {
  return (
    <Mentions
      options={["Alice", "Alex", "Bob"]}
      filterOption={(query, option) => option.value.toLowerCase().startsWith(query.toLowerCase())}
    />
  );
}
