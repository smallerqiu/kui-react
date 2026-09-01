import { useEffect, useRef, useState } from "react";
import { Avatar, Button, Card, CardMeta, Space, Skeleton } from "react-kui";
const item = {
  name: "KUI Design",
  intro: "KUI is a desktop UI component library based on React",
  desc: "Dozens of useful and aesthetically pleasing components, a very user-friendly API suitable for developers of any skill level, and comprehensive documentation.",
};
export default function App() {
  const [loading, setLoading] = useState(false),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const reload = () => {
    setLoading(true);
    timer.current = setTimeout(() => setLoading(false), 3000);
  };
  return (
    <>
      <Button disabled={loading} onClick={reload}>
        Reload
      </Button>
      <br />
      <br />
      <Space vertical block style={{ fontSize: 13 }}>
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            style={{ padding: "15px 20px", borderBottom: "1px solid var(--kui-color-border)" }}
          >
            <Skeleton avatar loading={loading} rows={2} animated>
              <CardMeta
                avatar={<Avatar size="large">{item.name}</Avatar>}
                title={item.name}
                description={item.intro}
              />
              <p style={{ margin: 0, marginTop: 15, lineHeight: "25px" }}>{item.desc}</p>
            </Skeleton>
          </Card>
        ))}
      </Space>
    </>
  );
}
