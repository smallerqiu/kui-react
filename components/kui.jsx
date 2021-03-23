import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

class Kui extends React.Component {
    classNames(...args) {
        return classnames(args)
    }

    className(...args) {
        return this.classNames.apply(this, args.concat([this.props.className]))
    }

    styles(args) {
        return Object.assign({}, args, this.props.style)
    }
    // componentWillMount(){
        
    // }
   
}

Kui.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
}

export { Kui, PropTypes }
