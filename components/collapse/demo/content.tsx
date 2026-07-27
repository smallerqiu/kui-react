import type { ReactNode } from "react";
import { Collapse, CollapsePanel } from "react-kui";

export const text =
  "A long time ago, In a beautiful kingdom, there lived a young king and queen, the people loved them so much;";

export function Panels({ extra }: { extra?: ReactNode }) {
  return (
    <>
      {[1, 2, 3].map((key) => (
        <CollapsePanel key={key} title="Panel title" extra={extra}>
          <div>{text}</div>
        </CollapsePanel>
      ))}
    </>
  );
}

export function CollapseDemo({
  accordion,
  sample,
  extra,
}: {
  accordion?: boolean;
  sample?: boolean;
  extra?: ReactNode;
}) {
  return (
    <div className="demo-collapse">
      <Collapse openKeys={["1"]} accordion={accordion} sample={sample}>
        {Panels({ extra })}
      </Collapse>
    </div>
  );
}
