let code = {}

code.base = `import { Menu } from 'react-kui';
const SubMenu = Menu.SubMenu
constructor(props) {
  super(props)
  this.state = {
    theme: "light",
  }
}
ReactDOM.render() {
  return (<div>
    <Menu mode="horizontal" theme={theme} activeName="1">
      <Menu.Item name="1" icon="ios-paper">我的产品</Menu.Item>
      <SubMenu name="1"
        title={<React.Fragment> <Icon type="android-walk" />商品管理 </React.Fragment>} >
        <Menu.Item name="1-1">商品信息</Menu.Item>
        <Menu.Item name="1-2">商品列表</Menu.Item>
        <Menu.Item name="1-3">商品新增</Menu.Item>
        <Menu.Item name="1-4">商品筛选</Menu.Item>
      </SubMenu>
      <SubMenu name="2" title={<React.Fragment> <Icon type="android-walk" />用户管理 </React.Fragment>} >
        <Menu.Group title="超级管理">
          <Menu.Item name="2-1">用户信息</Menu.Item>
          <Menu.Item name="2-2">用户列表</Menu.Item>
        </Menu.Group>
        <Menu.Group title="普通管理">
          <Menu.Item name="2-3">用户新增</Menu.Item>
          <Menu.Item name="2-4">用户筛选</Menu.Item>
        </Menu.Group>
      </SubMenu>
      <Menu.Item name="4" icon="social-apple">新闻管理</Menu.Item>
      <Menu.Item name="5" icon="locked">权限管理</Menu.Item>
    </Menu>
    <Radio.Group value={theme} onChange={(v) => this.setState({ theme: v })}>
      <Radio label="light"></Radio>
      <Radio label="dark"></Radio>
      <Radio label="primary"></Radio>
    </Radio.Group>
    </div>
  )
}`
code.theme = `import { Menu } from 'react-kui';
const SubMenu = Menu.SubMenu
ReactDOM.render() {
  return (
    <Row>
    <Col span="8">
      <Menu theme={theme} activeName="0-1" openName="0">
        <SubMenu name="0" title={<React.Fragment> <Icon type="android-walk" /> 我的产品 </React.Fragment>} >
          <Menu.Item name="0-1">我的产品1</Menu.Item>
          <Menu.Item name="0-2">我的产品2</Menu.Item>
          <Menu.Item name="0-3">我的产品3</Menu.Item>
          <Menu.Item name="0-4">我的产品4</Menu.Item>
        </SubMenu>
        <SubMenu name="1" title={<React.Fragment> <Icon type="android-walk" />商品管理  </React.Fragment>} >
          <Menu.Item name="1-1">商品信息</Menu.Item>
          <Menu.Item name="1-2">商品列表</Menu.Item>
          <Menu.Item name="1-3">商品新增</Menu.Item>
          <Menu.Item name="1-4">商品筛选</Menu.Item>
        </SubMenu>

        <SubMenu name="2" title={<React.Fragment> <Icon type="android-walk" />用户管理  </React.Fragment>} >
          <Menu.Group title="超级管理">
            <Menu.Item name="2-1">用户信息</Menu.Item>
            <Menu.Item name="2-2">用户列表</Menu.Item>
          </Menu.Group>
          <Menu.Group title="普通管理">
            <Menu.Item name="2-3">用户新增</Menu.Item>
            <Menu.Item name="2-4">用户筛选</Menu.Item>
          </Menu.Group>
        </SubMenu>
      </Menu>
    </Col>
    <Col span="8">
      <Menu theme={theme} activeName="0-1" accordion openName={'0'}>
        <SubMenu name="0" title={<React.Fragment><Icon type="ios-paper" />我的产品 </React.Fragment>} >
          <Menu.Item name="0-1">我的产品1</Menu.Item>
          <Menu.Item name="0-2">我的产品2</Menu.Item>
          <Menu.Item name="0-3">我的产品3</Menu.Item>
          <Menu.Item name="0-4">我的产品4</Menu.Item>
        </SubMenu>
        <SubMenu name="1" title={<React.Fragment><Icon type="social-apple" />商品管理 </React.Fragment>} >
          <Menu.Item name="1-1">商品信息</Menu.Item>
          <Menu.Item name="1-2">商品列表</Menu.Item>
          <Menu.Item name="1-3">商品新增</Menu.Item>
          <Menu.Item name="1-4">商品筛选</Menu.Item>
        </SubMenu>

        <SubMenu name="2" title={<React.Fragment><Icon type="android-walk" />用户管理 </React.Fragment>} >
          <Menu.Group title="超级管理">
            <Menu.Item name="2-1">用户信息</Menu.Item>
            <Menu.Item name="2-2">用户列表</Menu.Item>
          </Menu.Group>
          <Menu.Group title="普通管理">
            <Menu.Item name="2-3">用户新增</Menu.Item>
            <Menu.Item name="2-4">用户筛选</Menu.Item>
          </Menu.Group>
        </SubMenu>
      </Menu>
    </Col>
    <Col span="8" >
      <Menu theme={theme} activeName="1">
        <Menu.Group title="超级管理">
          <Menu.Item name="1">用户信息</Menu.Item>
          <Menu.Item name="2">用户列表</Menu.Item>
        </Menu.Group>
        <Menu.Group title="普通管理">
          <Menu.Item name="3">用户新增</Menu.Item>
          <Menu.Item name="4">用户筛选</Menu.Item>
        </Menu.Group>
      </Menu>
    </Col>
  </Row>
  )
}`

export default code