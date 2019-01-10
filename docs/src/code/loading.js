let code = {}

code.test = `import { Button,Loading } from 'react-kui';
config() {
  Loading.config({
    type: "line",
    color: "green",
    height: 5
  });
} 
start(type) {  Loading.start(type); }
loading(type) {
  Loading.start(type);
  setTimeout(() => {  this.finish();  }, 3000);
}
finish() {  Loading.finish();}
error() {  Loading.error(); }
ReactDOM.render() {
  return (
    <div>
    <Button onClick={()=>this.start('line')}>start</Button>
    <Button onClick={()=>this.finish()}>finish</Button>
    <Button onClick={()=>this.error()}>error</Button>
    <Button onClick={()=>this.config()}>config</Button>
    <Button onClick={()=>this.upload(30)}>upload 30</Button>
    <Button onClick={()=>this.upload(80)}>upload 80</Button>   
    </div>
  )
}` 
code.theme = `import { Button,Loading } from 'react-kui';
loading(type) {
  Loading.start(type);
  setTimeout(() => { Loading.finish();  }, 3000);
}
ReactDOM.render() {
  return (
    <div>
    <Button onClick={()=>this.loading('flip')}>flip</Button>
    <Button onClick={()=>this.loading('bounce')}>bounce</Button>
    <Button onClick={()=>this.loading('zoom')}>zoom</Button>
    <Button onClick={()=>this.loading('rotate')}>rotate</Button>  
    </div>
  )
}`

export default code