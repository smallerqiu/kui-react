import { useRef, useState } from "react";
import { Button, Popup, Space, type PopupOpenReason, type PopupRef } from "react-kui";
export default function App() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<PopupOpenReason>("programmatic");
  const popup = useRef<PopupRef>(null);
  return (
    <Space vertical>
      <Space>
        <Button
          onClick={(event) => {
            // This button is outside the anchor; do not treat this opening click as an outside click.
            event.stopPropagation();
            popup.current?.open();
          }}
        >
          Open via ref
        </Button>
        <Popup
          ref={popup}
          trigger="manual"
          open={open}
          onOpenChange={(next, detail) => {
            setOpen(next);
            setReason(detail.reason);
          }}
          overlay={({ close }) => (
            <Space vertical>
              <span>Click outside or press Escape.</span>
              <Button onClick={close}>Close from inside</Button>
            </Space>
          )}
        >
          <Button onClick={() => setOpen(!open)}>Toggle controlled popup</Button>
        </Popup>
      </Space>
      <span role="status">
        Open: {String(open)} · Reason: {reason}
      </span>
    </Space>
  );
}
