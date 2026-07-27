import Divider from "../index";
export default function WithText() {
  return (
    <div>
      <p>See the light through the mist!</p>
      <Divider orientation="left" text="Text" />
      <p>See the light through the mist!</p>
      <Divider>Text</Divider>
      <p>See the light through the mist!</p>
      <Divider orientation="right" text="Text" />
    </div>
  );
}
