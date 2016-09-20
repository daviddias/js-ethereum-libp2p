import React, {Component, PropTypes} from 'react'
import {Col, Glyph, Spinner} from 'elemental'
import {AutoSizer, List} from 'react-virtualized'
import {bufferToInt} from 'ethereumjs-util'

import ProcessingStatus from './processing-status'
import Hash from './hash'

function formatDate (buf) {
  const ts = bufferToInt(buf)
  const date = new Date(ts)
  return date.toLocaleString()
}

export default class Blocks extends Component {
  static propTypes = {
    feed: PropTypes.object.isRequired
  };

  _renderBlock = ({key, index, style}) => {
    const hash = this._feedValues[index]
    const item = this.props.feed[hash]
    const block = item.block

    return (
      <div key={key} style={style} className='block'>
        Number: {block.header.number}<br />
        Parent: <Hash value={block.header.parentHash} /><br />
        Time: {formatDate(block.header.timestamp)}<br />
        Status: <ProcessingStatus status={item.status} />
      </div>
    )
  }

  render () {
    let feed = (
      <div className='loader'>
        <Spinner size='md' type='primary' />
        <br />
        Loading your blocks
      </div>
    )

    this._feedValues = Object.keys(this.props.feed)
    if (this._feedValues && this._feedValues.length > 0) {
      feed = (
        <AutoSizer>
        {({ height, width }) => (
          <List
            width={width}
            height={height}
            rowCount={this._feedValues.length}
            rowHeight={80}
            rowRenderer={this._renderBlock}
          />
        )}
        </AutoSizer>
      )
    }
    return (
      <Col sm='1' md='1/3' lg='1/3' className='feed blocks'>
        <h2><Glyph icon='package' /> Blocks</h2>
        <div style={{ flex: '1 1 auto' }}>
          {feed}
        </div>
      </Col>
    )
  }
}
