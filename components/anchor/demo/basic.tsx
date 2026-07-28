import { Anchor, AnchorLink } from "react-kui";
export default function App() {
  return (
    <div
      className="anchor-demo-basic"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 180px",
        gap: 24,
        maxHeight: 500,
        overflow: "auto",
        padding: 24,
      }}
    >
      <div>
        {[
          ["part-1", "Basic"],
          ["part-2", "Guide"],
          ["part-3", "FAQ"],
        ].map(([id, title]) => (
          <section
            id={id}
            key={id}
            style={{
              height: 400,
              padding: 20,
              background: "var(--kui-color-bg-container)",
              marginBottom: 20,
            }}
          >
            <h2>{title}</h2>
            <p>Here is the {title.toLowerCase()} content...</p>
          </section>
        ))}
      </div>
      <Anchor offsetTop={20} container=".anchor-demo-basic">
        <AnchorLink href="#part-1" title="Basic" />
        <AnchorLink href="#part-2" title="Guide" />
        <AnchorLink href="#part-3" title="FAQ" />
      </Anchor>
    </div>
  );
}
