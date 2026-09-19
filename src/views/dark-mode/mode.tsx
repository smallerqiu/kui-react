import { Button, message, theme } from "react-kui";
export default function Mode() {
  return (
    <Button
      onClick={(event) =>
        theme.setThemeMode(event.nativeEvent, (event) =>
          message.info(`Current theme mode is ${event ? "dark" : "light"}`)
        )
      }
    >
      Switch
    </Button>
  );
}
