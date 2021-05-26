<cn>
#### 远程搜索
通过设置 `search` 值来呈现过滤模式,设置 `loading` 展示加载模式
</cn>

```tsx
import { Select , Button } from 'react-kui';
let {Option} = Select

const data= ['almond','apple','apple core','apple juice','apple skin','apricot','apricot flesh','apricot pit','areca nut','banana','banana skin','bargain price','beechnut','Beijing flowering crab','bitter','bitterness','bitter orange','blackberry','canned fruit','carambola','cherry','cherry pit','cherry pulp','chestnut','Chinese chestnut','Chinese date','Chinese gooseberry','Chinese walnut','coconut','coconut milk','coconut water','cold storage','cold store','crisp','cumquat','damson plum','Dangshan pear','date','date pit','decayed fruit','downy pitch','dry fruit','duke','early-maturing','fig','filbert','first class','flat peach','flavour','flesh','flesh fruit','fresh','fresh litchi','fruiterer','fruit in bags','fruit knife','fruits of the season','gingko','give full weigh','give short weight','grape','grape juice','grape skin','grapestone','greengage','Hami melon','Hard','haw','hawthorn','hazel','honey peach','in season','juicy','juicy peach','jujube','kernel','kumquat','late-maturing','lemon','litchi','litchi rind','longan','longan pulp','loquat','mandarine','mango','mature','morello','muskmelon','navel orange','nut','nut meat','nut shell','oleaster','olive','orange','orange peel','papaya','peach','pear','perishable','pineapple','plum','plumcot','pomegranate','pomelo','red bayberry','reduced price','ripe','rotten fruit','seasonable','seedless orange','special-grade','strawberry','sultana','superfine','tangerine','tart','tender','tinned fruit','unripe','walnut','walnut kernel','water chestnut','watermelon']

class Demo extends React.Component{

  state = {
    options1:[],
    options2:[],
    s1:'',
    loading1:false,
    loading2:false,
    s2:[],
  }

  search1 = (key) =>{
    this.setState({loading1:true})
    //模拟异步请求
    if(this.timeout){
      clearTimeout(this.timeout)
      this.timeout = null
    }
    this.timeout = setTimeout(t=>{
      let options1 =  data.filter(x=>x.indexOf(key)>=0)
      this.setState({options1 , loading1: false})
    },1500)
  }

  search2 = (key) =>{
    this.setState({loading2: true})
    //模拟异步请求
    if(this.timeout){
      clearTimeout(this.timeout)
      this.timeout = null
    }
    this.timeout = setTimeout(t=>{
      let options2 =  data.filter(x=>x.indexOf(key)>=0)
      this.setState({options2 , loading2: false})
    },1500)
  }

  render(){
    const {s1,s2 ,options1 ,options2 , loading1,loading2} = this.state
    const ops1 = options1.map(v=>{ return {value:v,label:v} } )
    const ops2 = options2.map(v=>{ return {value:v,label:v} } )
    return(
      <div className="demo-select">
        <p>Selected value: {s1}</p>
        <Select 
          value={s1} 
          onSearch={this.search1}
          width={512}
          loading={loading1}
          options={ops1}
          onChange={
            (v) => this.setState({s1: v})
          }
          placeholder="单选搜索">
        </Select>
        <p>Selected value: {s2.join()}</p>
        <Select 
          className="demo-select"
          multiple 
          width={512}
          loading={loading2}
          onSearch={this.search2}
          options={ops2}
          value={s2} 
          onChange={
            (v) => this.setState({s2: v})
          }
          placeholder="多选过滤">
        </Select>
      </div>
    )
  }
}
ReactDOM.render(<Demo />  ,  mountNode)
```