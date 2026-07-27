import BackTop from "../index";
export default function Custom() {
  return (
    <div>
      <BackTop bottom={100}>
        <div
          style={{
            background: "#2d94ff",
            height: 40,
            lineHeight: "40px",
            textAlign: "center",
            color: "white",
            padding: "0 10px",
          }}
        >
          UP
        </div>
      </BackTop>
      The custom button is the blue button.
    </div>
  );
}
