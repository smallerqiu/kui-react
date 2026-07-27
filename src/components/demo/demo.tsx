import { Copy, ListChevronsDownUp, ListChevronsUpDown } from "kui-icons";
import { useState, type ReactNode } from "react";
import { Button } from "react-kui";
import { copyToClipboard } from "react-kui/utils/share";

export interface DemoProps {
  title?: string;
  description?: string;
  source: string;
  direction?: string;
  children?: ReactNode;
}

export default function Demo({
  title,
  description,
  source,
  direction = "horizontal",
  children,
}: DemoProps) {
  const [expanded, setExpanded] = useState(direction !== "vertical");
  return (
    <section
      className={["markdown-body", "k-demo-container", expanded && "k-demo-expanded"]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="k-desc">
        <div className="k-desc-content">
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
      </div>
      <div
        className={["k-demo", direction === "horizontal" && "k-demo-horizontal"]
          .filter(Boolean)
          .join(" ")}
      >
        <div className={`k-demo-view k-demo-view-${direction}`}>
          <div className="k-content k-scroll">{children}</div>
        </div>
        {expanded && (
          <div className="k-code-box">
            <div className="k-code-tools">
              <Button
                type="text"
                size="small"
                icon={Copy}
                title="Copy code"
                onClick={() => void copyToClipboard(source)}
              />
            </div>
            <pre className="k-code k-scroll">
              <code>{source}</code>
            </pre>
          </div>
        )}
        {direction !== "horizontal" && (
          <div className="k-code-actions">
            <Button
              block
              size="large"
              type="text"
              icon={expanded ? ListChevronsDownUp : ListChevronsUpDown}
              onClick={() => setExpanded((value) => !value)}
            />
          </div>
        )}
      </div>
    </section>
  );
}
