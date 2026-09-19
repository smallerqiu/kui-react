import { useCallback, useRef, useState, type CSSProperties } from "react";
import en from "react-kui/locale/en";
import zhCN from "react-kui/locale/zh-CN";
import {
  Button,
  Card,
  ConfigProvider,
  DatePicker,
  Form,
  FormItem,
  Input,
  Page,
  Select,
  Space,
  Tag,
  type ShapeType,
  type SizeType,
  type ThemeType,
} from "react-kui";

const options = [
  { label: "Vue", value: "vue" },
  { label: "React", value: "react" },
];

const styles = {
  toolbar: { marginBottom: 16 },
  scope: {
    position: "relative",
    padding: 16,
    border: "1px dashed var(--kui-color-border)",
    borderRadius: "var(--kui-border-radius)",
  },
  heading: { marginBottom: 12 },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(var(--config-demo-columns, 3), minmax(0, 1fr))",
    gap: 12,
  },
  control: { width: "100%" },
  card: { maxWidth: 560 },
  description: { marginBottom: 12, color: "var(--kui-color-text-description)" },
  nested: {
    padding: 16,
    background: "var(--kui-color-bg-component)",
    borderRadius: "var(--kui-border-radius)",
  },
} satisfies Record<string, CSSProperties>;

export default function App() {
  const popupHost = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [size, setSize] = useState<SizeType>("small");
  const [theme, setTheme] = useState<ThemeType>("outline");
  const [shape, setShape] = useState<ShapeType>("square");
  const [model, setModel] = useState<Record<string, unknown>>({ keyword: "" });
  const getPopupContainer = useCallback(() => popupHost.current ?? document.body, []);

  const cycle = <T,>(current: T, values: T[], update: (value: T) => void) => {
    update(values[(values.indexOf(current) + 1) % values.length]);
  };

  return (
    <>
      <div className="config-demo">
        <Space wrap style={styles.toolbar}>
          <Button onClick={() => setLanguage((value) => (value === "zh" ? "en" : "zh"))}>
            locale: {language === "zh" ? "zh-CN" : "en"}
          </Button>
          <Button onClick={() => cycle(size, ["small", "medium", "large"], setSize)}>
            size: {size}
          </Button>
          <Button onClick={() => cycle(theme, ["outline", "fill", "plain"], setTheme)}>
            theme: {theme}
          </Button>
          <Button onClick={() => cycle(shape, ["square", "round", "circle"], setShape)}>
            shape: {shape}
          </Button>
        </Space>

        <div ref={popupHost} style={styles.scope}>
          <ConfigProvider
            locale={language === "zh" ? zhCN : en}
            size={size}
            theme={theme}
            shape={shape}
            getPopupContainer={getPopupContainer}
          >
            <Space vertical>
              <section>
                <h4 style={styles.heading}>Global appearance and locale</h4>
                <Form style={styles.form} model={model} layout="vertical" onChange={setModel}>
                  <FormItem label="Keyword" prop="keyword">
                    <Input style={styles.control} placeholder="Inherited Input" />
                  </FormItem>
                  <FormItem label="Framework">
                    <Select style={styles.control} options={[]} />
                  </FormItem>
                  <FormItem label="Date">
                    <DatePicker style={styles.control} />
                  </FormItem>
                </Form>
                <Space wrap>
                  <Button>Button</Button>
                  <Tag>Tag</Tag>
                  <Page total={80} page={2} showSizer showElevator />
                </Space>
              </section>

              <Card style={styles.card} title="Popup container">
                <p style={styles.description}>
                  The Select overlay is mounted in this dashed area instead of document.body.
                </p>
                <Select
                  style={styles.control}
                  value={model.popup as string | undefined}
                  options={options}
                  placeholder="Open popup"
                  onChange={(value) => setModel((current) => ({ ...current, popup: value }))}
                />
              </Card>

              <ConfigProvider size="large" theme="fill" shape="round">
                <section style={styles.nested}>
                  <h4 style={styles.heading}>嵌套 ConfigProvider</h4>
                  <Space wrap>
                    <Button>Nested Button</Button>
                    <Input style={styles.control} placeholder="Large fill round" />
                    <Tag>Nested Tag</Tag>
                  </Space>
                </section>
              </ConfigProvider>

              <section>
                <h4 style={styles.heading}>组件属性优先</h4>
                <Button size="large" theme="fill" shape="circle">
                  Local
                </Button>
              </section>
            </Space>
          </ConfigProvider>
        </div>
      </div>
      <style>{`
        .config-demo .k-form-item { margin-bottom: 8px; }
        @media (max-width: 720px) {
          .config-demo { --config-demo-columns: 1; }
        }
      `}</style>
    </>
  );
}
