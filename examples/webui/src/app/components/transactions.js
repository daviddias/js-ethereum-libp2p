import React, {Component, PropTypes} from 'react'
import {Col, Glyph, Spinner} from 'elemental'
import {AutoSizer, List} from 'react-virtualized'

import ProcessingStatus from './processing-status'

export default class Transactions extends Component {
  static propTypes = {
    feed: PropTypes.object.isRequired
  };

  _renderTransaction = ({key, index, style}) => {
    const hash = this._feedValues[index]
    const item = this.props.feed[hash]
    return (
      <div key={key} style={style} className='transaction'>
        {hash} <br />
        Status: <ProcessingStatus status={item.status} />
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

    this._feedValues = Object.keys(this.props.feed)
    if (this._feedValues && this._feedValues.length > 0) {
      feed = (
        <AutoSizer>
          {({ height, width }) => (
            <List
              width={width}
              height={height}
              rowCount={this._feedValues.length}
              rowHeight={50}
              rowRenderer={this._renderTransaction}
            />
           )}
        </AutoSizer>
      )
    }
    return (
      <Col sm='1' md='1/3' lg='1/3' className='feed transactions'>
        <h2><Glyph icon='list-unordered' /> Transactions</h2>
        <div className='feed-wrapper'>
          {feed}
        </div>
      </Col>
    )
  }
}
