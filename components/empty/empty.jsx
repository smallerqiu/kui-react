import React from 'react'
import { Kui, PropTypes } from '../kui'
import Icon from "../icon";

export default class Empty extends Kui {
  static propTypes = {
    description: PropTypes.any,
    image: PropTypes.any,
    imageStyle: PropTypes.object
  }

  render() {
    let { image, imageStyle, children, description } = this.props
    // description = getChild($slots.description).length > 0 || description
    // image = getChild($slots.image)
    // console.log(description, $slots.description)

    return (<div className="k-empty">
      {!image ?
        <Icon type="file-tray-outline" className="k-empty-icon" /> :
        (React.isValidElement(image) ? image : <img src={image} className="k-empty-image" style={imageStyle} />)}
      {description !== null ? <p className="k-empty-description">{description || '暂无数据'}</p> : null}
      {children ? <div className="k-empty-footer">{children}</div> : null}
    </div>)
  }
}