import { useCallback, useRef, useState } from "react";
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
        <Space wrap>
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

        <div ref={popupHost} className="config-scope">
          <ConfigProvider
            locale={language === "zh" ? zhCN : en}
            size={size}
            theme={theme}
            shape={shape}
            getPopupContainer={getPopupContainer}
          >
            <Space vertical>
              <section>
                <h4>Global appearance and locale</h4>
                <Form model={model} layout="vertical" onChange={setModel}>
                  <FormItem label="Keyword" prop="keyword">
                    <Input placeholder="Inherited Input" />
                  </FormItem>
                  <FormItem label="Framework">
                    <Select options={[]} />
                  </FormItem>
                  <FormItem label="Date">
                    <DatePicker />
                  </FormItem>
                </Form>
                <Space wrap>
                  <Button>Button</Button>
                  <Tag>Tag</Tag>
                  <Page total={80} page={2} showSizer showElevator />
                </Space>
              </section>

              <Card title="Popup container">
                <p>The Select overlay is mounted in this dashed area instead of document.body.</p>
                <Select
                  value={model.popup as string | undefined}
                  options={options}
                  placeholder="Open popup"
                  onChange={(value) => setModel((current) => ({ ...current, popup: value }))}
                />
              </Card>

              <ConfigProvider size="large" theme="fill" shape="round">
                <section className="nested-scope">
                  <h4>嵌套 ConfigProvider</h4>
                  <Space wrap>
                    <Button>Nested Button</Button>
                    <Input placeholder="Large fill round" />
                    <Tag>Nested Tag</Tag>
                  </Space>
                </section>
              </ConfigProvider>

              <section>
                <h4>组件属性优先</h4>
                <Button size="large" theme="fill" shape="circle">
                  Local
                </Button>
              </section>
            </Space>
          </ConfigProvider>
        </div>
      </div>
      <style>{`
        .config-demo > .k-space { margin-bottom: 16px; }
        .config-scope { position: relative; padding: 16px; border: 1px dashed var(--kui-color-border); border-radius: var(--kui-border-radius); }
        .config-scope section h4 { margin-bottom: 12px; }
        .config-scope .k-form { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
        .config-scope .k-form-item { margin-bottom: 8px; }
        .config-scope .k-input,
        .config-scope .k-select,
        .config-scope .k-date-picker { width: 100%; }
        .config-scope .k-card { max-width: 560px; }
        .config-scope .k-card p { margin-bottom: 12px; color: var(--kui-color-text-description); }
        .config-scope .nested-scope { padding: 16px; background: var(--kui-color-bg-component); border-radius: var(--kui-border-radius); }
        @media (max-width: 720px) { .config-scope .k-form { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
