import React, {Component, PropTypes} from 'react'
import {Col, Glyph, Spinner} from 'elemental'
import {AutoSizer, List} from 'react-virtualized'

import Block from './block'

export default class Blocks extends Component {
  static propTypes = {
    feed: PropTypes.object.isRequired
  };

  _renderBlock = ({key, index, style}) => {
    const hash = this._feedValues[index]
    const item = this.props.feed[hash]

    return (
      <Block key={key} status={item.status} block={item.block} />
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
