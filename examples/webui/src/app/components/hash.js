import React, {Component, PropTypes} from 'react'

export default class Hash extends Component {
  static propTypes = {
    value: PropTypes.any.isRequired
  };

  render () {
    const {value} = this.props
    return (
      <code className='hash'>
        {value.toString('hex').substring(0, 16)}...
      </code>
    )
  }
}
