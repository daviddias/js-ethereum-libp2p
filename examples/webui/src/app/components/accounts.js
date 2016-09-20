import React, {Component, PropTypes} from 'react'
import {Col, Glyph, Spinner} from 'elemental'
import {AutoSizer, List} from 'react-virtualized'

import ProcessingStatus from './processing-status'

export default class Accounts extends Component {
  static propTypes = {
    feed: PropTypes.object.isRequired
  };

  _renderAccount = ({key, index}) => {
    const hash = this._feedValues[index]
    const item = this.props.feed[hash]

    return (
      <div key={key} className='account'>
        {hash}: {item.account.balance}Ether <br />
        Status: <ProcessingStatus status={item.status} />
      </div>
    )
  }

  render () {
    let feed = (
      <div className='loader'>
        <Spinner size='md' type='primary' />
        <br />
        Loading your accounts
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
            rowRenderer={this._renderAccount}
          />
        )}
        </AutoSizer>
      )
    }
    return (
      <Col sm='1' md='1' lg='1' className='feed accounts'>
        <h2><Glyph icon='credit-card' /> Accounts</h2>
        <div className='feed-wrapper'>
          {feed}
        </div>
      </Col>
    )
  }
}
