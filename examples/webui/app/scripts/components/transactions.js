import React, {Component, PropTypes} from 'react'
import {Col, Glyph, Spinner} from 'elemental'
import {AutoSizer, List} from 'react-virtualized'

export default class Transactions extends Component {
  static propTypes = {
    feed: PropTypes.array.isRequired
  };

  _renderTransaction = ({key, index, style}) => {
    const item = this.props.feed[index]
    return (
      <div key={key} style={style} className='transaction'>
        {item.hash}
      </div>
    )
  }

  render () {
    let feed = (
      <div className='loader'>
        <Spinner size='md' type='primary' />
        <br />
        Loading your transactions
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
            rowRenderer={this._renderTransaction}
          />
        )}
        </AutoSizer>
      )
    }
    return (
      <Col sm='1' md='1/3' lg='1/3' className='feed transactions'>
        <h2><Glyph icon='list-unordered' /> Transactions</h2>
        <div style={{ flex: '1 1 auto' }}>
          {feed}
        </div>
      </Col>
    )
  }
}
