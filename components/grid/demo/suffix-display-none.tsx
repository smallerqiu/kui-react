import { Button, Grid, GridItem, Input, Option, Select } from "react-kui";
export default function App() {
  return (
    <Grid cols={{ xs: 2, md: 6 }} xGap={8}>
      <GridItem span={2}>
        <Input placeholder="Search keywords..." />
      </GridItem>
      <GridItem span={{ xs: 0, md: 2 }}>
        <Select>
          <Option value={1}>Filter</Option>
        </Select>
      </GridItem>
      <GridItem suffix style={{ justifySelf: "end" }}>
        <Button>Query</Button>
      </GridItem>
    </Grid>
  );
}
