import { Button } from "../../../components/button";
import message from "../../../components/message";
import theme from "../../../components/utils/theme";
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
