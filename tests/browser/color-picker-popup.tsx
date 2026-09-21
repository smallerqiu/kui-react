import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { ColorPicker } from "../../components";
import "../../components/styles/index.less";

export function Fixture() {
  const [value, setValue] = useState("#3a95ff");
  const [events, setEvents] = useState<boolean[]>([]);
  return (
    <main style={{ padding: 80 }}>
      <ColorPicker
        trigger={location.search.includes("hover") ? "hover" : "click"}
        value={value}
        onChange={setValue}
        onOpenChange={(open) => setEvents((current) => [...current, open])}
      />
      <output>{JSON.stringify(events)}</output>
    </main>
  );
}

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <Fixture />
  </StrictMode>,
);
