import { useState } from "react";
import { Button, TypographyText } from "react-kui";
const motions = [
  "k-motion-fade-in",
  "k-motion-scale-in",
  "k-motion-scale-y-in",
  "k-motion-slide-in-from-left",
  "k-motion-slide-in-from-right",
  "k-motion-slide-in-from-bottom",
];
export default function App() {
  const [key, setKey] = useState(0);
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <Button onClick={() => setKey((value) => value + 1)}>Replay animations</Button>
      <div
        key={key}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 24,
        }}
      >
        {motions.map((motion) => (
          <div
            key={motion}
            style={{
              display: "grid",
              justifyItems: "center",
              gap: 12,
              padding: "24px 12px",
              overflow: "hidden",
              border: "1px solid var(--kui-color-border)",
              borderRadius: "var(--kui-card-radius)",
            }}
          >
            <div
              className={motion}
              style={{
                width: 64,
                height: 64,
                borderRadius: "var(--kui-shape-round)",
                background: "var(--kui-color-primary)",
              }}
            />
            <TypographyText code>{motion}</TypographyText>
          </div>
        ))}
      </div>
    </div>
  );
}
