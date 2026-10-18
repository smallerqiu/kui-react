import { StatCard, Grid, type StatNumberItem, type SurfaceThemeType } from "react-kui";

// The stat card takes the same five tiers as the other cards and starts on `fill`. `solid` is the tier worth
// looking at here: the numbers and their captions both go to the light ink of the plate, and `plain` leaves
// them with no box at all. One short item list, so the only thing moving down the row is the surface.
const tiers: SurfaceThemeType[] = ["fill", "outline", "plain", "solid", "dashed"];
const items: StatNumberItem[] = [{ value: 5872, desc: "订单数" }];

export default function App() {
  return (
    <Grid cols={5} xGap={12} yGap={12}>
      {tiers.map((tier) => (
        <StatCard key={tier} title={`theme: ${tier}`} items={items} theme={tier} size="small" />
      ))}
    </Grid>
  );
}
