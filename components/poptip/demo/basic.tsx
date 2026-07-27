import { Button } from "../../button";
import Space from "../../space";
import Poptip from "../index";

export default function Basic() {
  return (
    <Space>
      <Poptip title="Title" content={<p>See the light through the mist!</p>}>
        <Button type="primary">Hover me</Button>
      </Poptip>
      <Poptip
        dark
        content={
          <>
            <p>See the light through the mist!</p>
            <p>See the light through the mist!</p>
          </>
        }
      >
        <Button type="primary">No title</Button>
      </Poptip>
    </Space>
  );
}
