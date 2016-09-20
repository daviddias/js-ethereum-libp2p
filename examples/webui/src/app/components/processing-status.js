import React, {PropTypes, Component} from 'react'
import {Glyph} from 'elemental'

export default class ProcessingStatus extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired
  };

  render () {
    const {status} = this.props

    let type = 'default'
    if (status === 'received') {
      type = 'warning'
    }

    if (status === 'processed') {
      type = 'success'
    }

    return (
      <Glyph icon='primitive-dot' type={type} />
    )
  }
}
