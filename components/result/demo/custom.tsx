import { DatabaseZap } from "kui-icons";
import { Button, Icon, Result } from "react-kui";
export default function App() { return <Result title="迁移任务已就绪" subTitle="确认信息后即可开始迁移。" icon={<Icon type={DatabaseZap} />} extra={<Button type="primary">开始迁移</Button>}>预计迁移 1,240 条记录，过程大约需要 3 分钟。</Result>; }
