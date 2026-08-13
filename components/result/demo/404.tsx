import { Button, Result } from "react-kui";
export default function App() { return <Result status="404" title="Not Found" subTitle="Sorry, the page you visited got lost." extra={<Button type="primary">Back Home</Button>} />; }
