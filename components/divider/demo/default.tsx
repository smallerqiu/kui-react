import Divider from "../index";
export default function DefaultDivider() {
  return (
    <div>
      <p>See the light through the mist!</p>
      <Divider />
      <p>See the light through the mist!</p>
      <Divider>Text</Divider>
      <p>See the light through the mist!</p>
      <Divider dashed />
      <p>See the light through the mist!</p>
    </div>
  );
}
