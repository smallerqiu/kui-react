import { Button, Result, Space } from "react-kui";
export default function App() { return <Result status="500" title="Something Went Wrong" subTitle="Sorry, please try again later." extra={<Space><Button type="primary">Back Home</Button><Button>Try Again</Button></Space>} />; }
