import { createRoot } from "react-dom/client";
import { useState } from "react";
import Page from "../../components/page";
import "../../components/styles/index.less";
export function Fixture() {
  const [changes, setChanges] = useState(0);
  const [responsive, setResponsive] = useState(true);
  return (
    <>
      <button id="responsive" onClick={() => setResponsive((value) => !value)}>
        Responsive
      </button>
      <output id="changes">{changes}</output>
      <div id="container" style={{ width: 1000, display: "flex" }}>
        <Page
          total={10000}
          page={50}
          responsive={responsive}
          showSizer
          showElevator
          onChange={() => setChanges((n) => n + 1)}
        />
      </div>
    </>
  );
}
createRoot(document.getElementById("app")!).render(<Fixture />);
