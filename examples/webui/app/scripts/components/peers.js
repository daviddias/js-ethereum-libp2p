import React, {Component, PropTypes} from 'react'
import {Col, Glyph, Spinner} from 'elemental'
import {AutoSizer, List} from 'react-virtualized'

export default class Peers extends Component {
  static propTypes = {
    feed: PropTypes.array.isRequired
  };

  _renderAddr = ({key, index, style}) => {
    const item = this.props.feed[index]
    return (
      <div key={key} style={style} className='peer'>
        <Glyph icon='chevron-right' /> {item.toString()}
      </div>
    )
  }

  render () {
    let feed = (
      <div className='loader'>
        <Spinner size='md' type='primary' />
        <br />
        Loading your peers
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
            rowHeight={20}
            rowRenderer={this._renderAddr}
          />
        )}
        </AutoSizer>
      )
    }
    return (
      <Col sm='1' md='1' lg='1' className='peers feed'>
        <h2>Peers</h2>
        {feed}
      </Col>
    )
  }
}
