import { Button, Result } from "react-kui";
export default function App() { return <Result status="403" title="Access Denied" subTitle="Sorry, you are not authorized to access this page." extra={<Button>Back Home</Button>} />; }
