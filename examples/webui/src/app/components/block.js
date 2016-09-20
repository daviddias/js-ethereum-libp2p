import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import {bufferToInt} from 'ethereumjs-util'
import {Row, Col} from 'elemental'

import Hash from './hash'
import ProcessingStatus from './processing-status'

function formatDate (buf) {
  const ts = bufferToInt(buf)
  // * 1000 it's a unix timestamp
  const date = new Date(ts * 1000)
  return moment(date).fromNow()
}

export default class Block extends Component {
  static propTypes = {
    block: PropTypes.object.isRequired,
    status: PropTypes.string.isRequired
  };

  render () {
    const {block, status} = this.props
    return (
      <Row className='block'>
        <Col sm='1/3' className={`block-number ${status}`}>
          Block {block.header.number}<br />
        </Col>

        <Col sm='2/3' className='block-details'>
          <em>Parent</em> <Hash value={block.header.parentHash} /><br />
          <em>Created</em> {formatDate(block.header.timestamp)}
        </Col>
      </Row>
    )
  }
}
