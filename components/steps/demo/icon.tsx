import { CircleCheck, CreditCard, User } from "kui-icons";
import { Icon, Steps } from "react-kui";
export default function App() {
  return (
    <Steps
      current={1}
      items={[
        { title: "账号信息", icon: <Icon type={User} /> },
        { title: "支付方式", icon: <Icon type={CreditCard} /> },
        { title: "完成", icon: <Icon type={CircleCheck} /> },
      ]}
    />
  );
}
