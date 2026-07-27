import { useEffect, useRef, useState } from "react";
import { Button } from "../../button";
import { Skeleton } from "../index";
export default function Child() {
  const [loading, setLoading] = useState(false),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );
  const reload = () => {
    setLoading(true);
    timer.current = setTimeout(() => setLoading(false), 3000);
  };
  return (
    <>
      <Skeleton loading={loading} rows={2} animated>
        <div>
          <h4 style={{ fontWeight: "bold", marginBottom: 15 }}>
            KUI is a desktop UI component library based on React
          </h4>
          <p>
            Dozens of useful and aesthetically pleasing components, a very user-friendly API
            suitable for developers of any skill level, comprehensive documentation, and support for
            modern React applications.
          </p>
        </div>
      </Skeleton>
      <br />
      <br />
      <Button disabled={loading} onClick={reload}>
        Reload
      </Button>
    </>
  );
}
