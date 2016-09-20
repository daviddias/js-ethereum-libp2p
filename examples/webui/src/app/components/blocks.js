import React, {Component, PropTypes} from 'react'
import {Col, Glyph, Spinner} from 'elemental'
import {AutoSizer, List} from 'react-virtualized'

import Block from './block'

export default class Blocks extends Component {
  static propTypes = {
    feed: PropTypes.array.isRequired
  };

  _renderBlock = ({key, index, style}) => {
    const item = this.props.feed[index]

    return (
      <Block key={key} style={style} status={item.status} block={item.block} />
    )
  }

  render () {
    let feed = (
      <div className='loader'>
        <Spinner size='md' type='primary' />
        <br />
        Loading blocks
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
              rowHeight={70}
              rowRenderer={this._renderBlock}
            />
           )}
        </AutoSizer>
      )
    }
    return (
      <Col sm='1' md='1/3' lg='1/3' className='feed blocks'>
        <h2><Glyph icon='package' /> Blocks</h2>
        <div className='feed-wrapper'>
          {feed}
        </div>
      </Col>
    )
  }
}
