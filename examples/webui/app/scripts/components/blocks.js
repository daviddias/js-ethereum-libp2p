import React, {Component, PropTypes} from 'react'
import {Col, Glyph, Spinner} from 'elemental'
import {AutoSizer, List} from 'react-virtualized'
import {bufferToInt} from 'ethereumjs-util'

function formatDate (buf) {
  const ts = bufferToInt(buf)
  const date = new Date(ts)
  return date.toLocaleString()
}

export default class Blocks extends Component {
  static propTypes = {
    feed: PropTypes.array.isRequired
  };

  _renderBlock = ({key, index, style}) => {
    const item = this.props.feed[index]

    return (
      <div key={key} style={style} className='block'>
        Number: {item.header.number}<br />
        Parent: {item.header.parentHash}<br />
        Time: {formatDate(item.header.timestamp)}<br />
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

    if (this.props.feed && this.props.feed.length > 0) {
      feed = (
        <AutoSizer>
        {({ height, width }) => (
          <List
            width={width}
            height={height}
            rowCount={this.props.feed.length}
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
