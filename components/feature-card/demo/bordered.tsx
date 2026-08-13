import { Code } from "kui-icons";
import { FeatureCard, Grid } from "react-kui";

export default function App() {
  return (
    <Grid cols={2} xGap={16}>
      <FeatureCard bordered icon={Code} title="显示边框" desc="适合放置在普通页面背景中。" />
      <FeatureCard icon={Code} title="隐藏边框" desc="默认不显示边框，适合层次化容器。" />
    </Grid>
  );
}
