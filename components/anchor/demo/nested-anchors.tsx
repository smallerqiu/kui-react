import { Anchor, AnchorLink } from "../index";
export default function Nested() {
  return (
    <div
      className="anchor-demo-nested"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 200px",
        maxHeight: 500,
        overflow: "auto",
      }}
    >
      <div style={{ padding: 40 }}>
        <h1 id="api">API</h1>
        <div style={{ height: 300 }} />
        <h2 id="props">Props</h2>
        <div style={{ height: 260 }} />
        <h3 id="anchor-props">Anchor Props</h3>
        <div style={{ height: 260 }} />
        <h2 id="events">Events</h2>
        <div style={{ height: 400 }} />
      </div>
      <Anchor container=".anchor-demo-nested">
        <AnchorLink href="#api" title="API">
          <AnchorLink href="#props" title="Props">
            <AnchorLink href="#anchor-props" title="Anchor Props" />
          </AnchorLink>
          <AnchorLink href="#events" title="Events" />
        </AnchorLink>
      </Anchor>
    </div>
  );
}
