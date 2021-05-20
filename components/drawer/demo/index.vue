<script>
import Info from './info' 
import Base from './base' 
import Custom from './custom' 
import Form from './form' 
import CN from '../index.md'
export default {
  render() {
    return (
      <div>
        <Info className="typo" />
        <Base />
        <Custom />
        <Form />
        <CN className="typo" />
      </div>
    )
  }
}

</script> 