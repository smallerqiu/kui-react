import dayjs from "dayjs";
import "dayjs/locale/de";
import "dayjs/locale/zh-cn";
import { useEffect, useState, type CSSProperties } from "react";
import {
  Button,
  Card,
  ConfigProvider,
  DatePicker,
  Modal,
  Page,
  RadioGroup,
  Select,
  Space,
  Table,
  TreeSelect,
} from "react-kui";
import de from "react-kui/locale/de";
import en from "react-kui/locale/en";
import zh from "react-kui/locale/zh-CN";

const locales = { en, zh, de };
type Language = keyof typeof locales;
const dayjsLocales: Record<Language, string> = {
  en: "en",
  zh: "zh-cn",
  de: "de",
};
const columns = [
  { title: "Name", key: "name" },
  { title: "Age", key: "age" },
];

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(var(--language-demo-columns, 2), minmax(0, 1fr))",
    gap: 16,
  },
  control: { width: "100%" },
  wide: { minWidth: 0, gridColumn: "1 / -1" },
  overflow: { overflowX: "auto" },
} satisfies Record<string, CSSProperties>;

export default function LanguageDemo() {
  const [lang, setLang] = useState<Language>("en");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    dayjs.locale(dayjsLocales[lang]);
  }, [lang]);

  return (
    <>
      <Space className="language-demo" vertical block size="large">
        <Space align="center" wrap>
          <strong>Language</strong>
          <RadioGroup
            value={lang}
            onChange={setLang}
            type="button"
            options={[
              { value: "en", label: "English" },
              { value: "zh", label: "中文" },
              { value: "de", label: "Deutsch" },
            ]}
          />
        </Space>

        <ConfigProvider locale={locales[lang]}>
          <div style={styles.grid}>
            <Card title="Date and time" bordered>
              <Space vertical block>
                <DatePicker />
                <DatePicker mode="dateRange" />
                <DatePicker mode="time" />
              </Space>
            </Card>

            <Card title="Selection" bordered>
              <Space vertical block>
                <div style={styles.control}>
                  <Select style={styles.control} options={[]} />
                </div>
                <div style={styles.control}>
                  <TreeSelect style={styles.control} treeData={[]} />
                </div>
              </Space>
            </Card>

            <Card style={styles.wide} title="Data feedback" bordered>
              <Space vertical block>
                <div style={styles.overflow}>
                  <Page total={85} showTotal showSizer showElevator />
                </div>
                <Table columns={columns} data={[]} />
              </Space>
            </Card>

            <Card style={styles.wide} title="Overlay" bordered>
              <Button onClick={() => setVisible(true)}>Open Modal</Button>
              <Modal
                open={visible}
                title="Locale preview"
                onClose={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                onOk={() => setVisible(false)}
              >
                The buttons and other built-in text follow the current locale.
              </Modal>
            </Card>
          </div>
        </ConfigProvider>
      </Space>
      <style>{`
        @media (max-width: 720px) {
          .language-demo { --language-demo-columns: 1; }
        }
      `}</style>
    </>
  );
}
