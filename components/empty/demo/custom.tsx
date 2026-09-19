import { Plus } from "kui-icons";
import { Button, Space, Empty } from "react-kui";
export default function App() {
  return (
    <Space vertical block>
      <Empty
        image="https://cdn.chuchur.com/img/thumb.png"
        description="No image"
        imageStyle={{ height: 60 }}
      >
        <Button type="primary" shape="circle" icon={Plus} size="small">
          Upload a image
        </Button>
      </Empty>
      <br />
      Use React nodes
      <br />
      <Empty
        description={
          <>
            Currently no <a>images</a>
          </>
        }
        image={<img src="https://cdn.chuchur.com/img/thumb.png" style={{ height: 60 }} alt="" />}
      >
        <Button type="primary" shape="circle" icon={Plus} size="small">
          Upload a image
        </Button>
      </Empty>
    </Space>
  );
}
