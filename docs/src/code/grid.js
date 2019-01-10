let code = {}

code.base = `import { Row , Col } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Row>
        <Col span="12">col-12</Col>
        <Col span="12">col-12</Col>
      </Row>
      <Row>
        <Col span="8">col-8</Col>
        <Col span="8">col-8</Col>
        <Col span="8">col-8</Col>
      </Row>
      <Row>
        <Col span="6">col-6</Col>
        <Col span="6">col-6</Col>
        <Col span="6">col-6</Col>
        <Col span="6">col-6</Col>
      </Row>
    </div>
  )
}`

code.gutter = `import { Row , Col } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Row gutter="10" className="pd">
        <Col span="6">
          <div>col-6</div>
        </Col>
        <Col span="6">
          <div>col-6</div>
        </Col>
        <Col span="6">
          <div>col-6</div>
        </Col>
        <Col span="6">
          <div>col-6</div>
        </Col>
      </Row>
    </div>
  )
}`

code.offset = `import { Row , Col } from 'react-kui';
ReactDOM.render() {
  return (
    <div>
      <Row>
        <Col span="8">col-8</Col>
        <Col span="8" offset="8">col-8 | offset-8</Col>
      </Row>
      <Row>
        <Col span="6">col-6</Col>
        <Col span="6" offset="6">col-6 | offset-6</Col>
        <Col span="6">col-6</Col>
      </Row>
      <Row>
        <Col span="12" offset="12">col-12 offset-12</Col>
      </Row>
    </div>
  )
}`

export default code