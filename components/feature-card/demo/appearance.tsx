import { Zap } from "kui-icons";
import { FeatureCard, Grid, type SurfaceThemeType } from "react-kui";

// The feature card paints the same five tiers as the plain card and starts on `fill`; `solid` puts the icon
// plate and the title on the primary, which is the one tier that moves the text, and `plain` drops the box
// around the content entirely. Kept to `direction="vertical"` and one line of copy so the five read as a row
// of the same card rather than five different layouts.
const tiers: SurfaceThemeType[] = ["fill", "outline", "plain", "solid", "dashed"];

export default function App() {
  return (
    <Grid cols={5} xGap={12} yGap={12}>
      {tiers.map((tier) => (
        <FeatureCard
          key={tier}
          icon={Zap}
          title={`theme: ${tier}`}
          direction="vertical"
          size="small"
          theme={tier}
        />
      ))}
    </Grid>
  );
}
