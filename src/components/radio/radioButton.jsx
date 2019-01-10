import React from 'react'
import { Kui, PropTypes } from '../kui'
import Button from '../button'
export default class RadioButton extends Kui {
    onClick() {
        if (this.props.onChange) {
            this.props.onChange(true);
            this.props.onFormItemChange && this.props.onFormItemChange(true)
        }
    }
    render() {
        let { label, disabled, mini, actived } = this.props
        return (<Button type={actived ? 'primary' : 'default'} disabled={disabled} mini={mini} onClick={this.onClick.bind(this)}>
            {label}
        </Button>)
    }
}
RadioButton.propTypes = {
    label: PropTypes.string,
    disabled: PropTypes.bool,
    mini: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    actived: PropTypes.bool,
    onChange: PropTypes.func
}
/* <template>
  <k-button :type="actived?'primary':'default'" :disabled="disabled" :mini="mini" @click="click">
    <slot>{{label}}</slot>
  </k-button>
</template>
<script>
import { Button } from '../button'
import emitter from '@/mixins/emitter'
export default {
  name: 'RadioButton',
  components: { 'k-button': Button },
  mixins: [emitter],
  props: {
    label: String,
  },
  data() {
    return {
      disabled: false,
      mini: false,
      actived: false
    }
  },
  methods: {
    click() {
      !this.selected && this.dispatch('RadioGroup', 'radio-group-change', {
        value: this.label,
      })
    }
  }
}
</script> */
