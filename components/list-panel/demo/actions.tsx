import { Plus, RotateCcw, Search } from "kui-icons";
import { Button, Empty, Input, ListPanel } from "react-kui";
export default function App() {
  return (
    <ListPanel
      summary="Updated just now"
      filters={<Input icon={Search} placeholder="Search projects" style={{ width: 200 }} />}
      actions={
        <>
          <Button icon={RotateCcw}>Reset</Button>
          <Button type="primary" icon={Plus}>
            Create
          </Button>
        </>
      }
    >
      <Empty description="No matching projects" />
    </ListPanel>
  );
}
