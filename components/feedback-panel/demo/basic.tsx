import { Button, FeedbackPanel, Space } from "react-kui";

export default function App() {
  return (
    <FeedbackPanel
      kind="positive"
      heading="Workspace created."
      description="Member permissions and default views have been configured."
      actions={<Space><Button type="primary">Open workspace</Button><Button>View Settings</Button></Space>}
    />
  );
}
