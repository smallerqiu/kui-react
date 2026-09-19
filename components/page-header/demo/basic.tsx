import { Button, PageHeader } from "react-kui";

export default function App() {
  return (
    <PageHeader
      title="Project overview"
      description="Track progress and recent activity."
      actions={
        <>
          <Button>Export</Button>
          <Button type="primary">Create</Button>
        </>
      }
    />
  );
}
