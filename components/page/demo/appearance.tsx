import { Page, type SurfaceThemeType } from "react-kui";

// The tier lands on the page-number cells, not on the bar around them: `fill` — the pager's own look — gives
// each cell a pale plate, `outline` and `dashed` edge them instead, `plain` leaves them bare, and `solid`
// plates them on the primary and inverts the digits and the ellipsis. The current page flips to a white cell
// with primary digits under `solid`, and the total line plus the previous/next arrows keep the bar's own
// background in every tier — they are not cells.
const tiers: SurfaceThemeType[] = ["fill", "outline", "plain", "solid", "dashed"];

export default function App() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {tiers.map((tier) => (
        <div key={tier} style={{ display: "grid", gap: 6, justifyItems: "start" }}>
          <code>theme: {tier}</code>
          <Page page={2} pageSize={10} total={80} theme={tier} showTotal={false} />
        </div>
      ))}
    </div>
  );
}
