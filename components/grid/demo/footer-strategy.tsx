import { Grid, GridItem } from "../index";
export default function FooterStrategy() {
  return (
    <Grid cols={{ xs: 1, sm: 2, md: 5 }} yGap={30}>
      <GridItem span={{ xs: 1, md: 2 }}>
        <h3>Company Logo</h3>
        <p>Leading Grid solutions worldwide.</p>
      </GridItem>
      {[
        ["Products", "Feature 1", "Feature 2"],
        ["Support", "Docs", "Community"],
        ["Contact", "Email", "Social"],
      ].map(([title, ...items]) => (
        <GridItem key={title}>
          <h4>{title}</h4>
          <ul>
            {items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </GridItem>
      ))}
    </Grid>
  );
}
