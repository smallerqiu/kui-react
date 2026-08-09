import { LogoKui } from "kui-icons";
import {
  Button,
  Card,
  Carousel,
  CarouselItem,
  Col,
  Content,
  Divider,
  Footer,
  Header,
  Icon,
  Layout,
  Menu,
  MenuItem,
  Row,
  Space,
} from "react-kui";

const styles = `
.portal-layout { padding: 20px; border: 1px solid var(--kui-color-border); }
.portal-layout .container { max-width: 1200px; margin: 0 auto; display: flex; width: 100%; }
.portal-layout .portal-header { background: var(--kui-color-bg); border-bottom: 1px solid var(--kui-color-border); position: sticky; top: 0; z-index: 100; }
.portal-layout .portal-menu { flex: 1; border-bottom: none; justify-content: center; }
.portal-layout .hero { background: linear-gradient(135deg, #188fff7f 0%, #096dd927 100%); padding: 80px 0; text-align: center; }
.portal-layout .hero h1 { font-size: 48px; margin-bottom: 16px; }
.portal-layout .content-main { padding: 64px 0; }
.portal-layout .portal-footer { padding: 48px 0 24px; }
.portal-layout .footer-grid { display: flex; justify-content: space-between; margin-bottom: 32px; }
.portal-layout .footer-col h4 { margin-bottom: 16px; }
.portal-layout .copyright { text-align: center; font-size: 12px; }
`;

export default function App() {
  return (
    <>
      <style>{styles}</style>
      <Layout className="portal-layout">
        <Header className="portal-header">
          <div className="container">
            <Space className="logo">
              <Icon type={LogoKui} size={20} />
              KUI PRO
            </Space>
            <Menu mode="horizontal" className="portal-menu">
              <MenuItem menuKey="home">Home</MenuItem>
              <MenuItem menuKey="comp">Components</MenuItem>
              <MenuItem menuKey="resource">Resources</MenuItem>
              <MenuItem menuKey="community">Community</MenuItem>
            </Menu>
            <Space className="actions">
              <Button size="small">Sign in</Button>
              <Button type="primary" size="small">
                Get started
              </Button>
            </Space>
          </div>
        </Header>

        <Content>
          <Carousel loop>
            {Array.from({ length: 3 }, (_, index) => (
              <CarouselItem key={index} style={{ height: 300 }}>
                <div className="hero">
                  <h1>Connecting beauty with technology</h1>
                  <p>A minimalist enterprise-grade UI component library for React</p>
                </div>
              </CarouselItem>
            ))}
          </Carousel>
          <div className="container content-main">
            <Row gutter={24}>
              {Array.from({ length: 3 }, (_, index) => (
                <Col span={8} key={index}>
                  <Card title="Feature Showcase">
                    <p>Powered by native CSS Variables, it supports instant theme switching.</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Content>

        <Footer className="portal-footer">
          <div className="container footer-grid">
            <div className="footer-col">
              <h4>About KUI</h4>
              <p>Committed to delivering the ultimate developer experience</p>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <a>Design draft</a>
              <br />
              <a>Change logs</a>
            </div>
            <div className="footer-col">
              <h4>Help</h4>
              <a>Report Bug</a>
              <br />
              <a>Q &amp; A</a>
            </div>
          </div>
          <Divider />
          <div className="copyright">Copyright © 2026 KUI Team. All Rights Reserved.</div>
        </Footer>
      </Layout>
    </>
  );
}
