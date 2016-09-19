import React, {Component, PropTypes} from 'react'
import {Col, Glyph, Spinner} from 'elemental'
import {AutoSizer, List} from 'react-virtualized'

export default class Accounts extends Component {
  static propTypes = {
    feed: PropTypes.array.isRequired
  };

  _renderAccount = ({key, index, style}) => {
    const item = this.props.feed[index]
    return (
      <div key={key} style={style} className='account'>
        {item.hash}: {item.balance}
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

    if (this.props.feed && this.props.feed.length > 0) {
      feed = (
        <AutoSizer>
        {({ height, width }) => (
          <List
            width={width}
            height={height}
            rowCount={this.props.feed.length}
            rowHeight={20}
            rowRenderer={this._renderAccount}
          />
        )}
        </AutoSizer>
      )
    }
    return (
      <Col sm='1' md='1' lg='1' className='feed accounts'>
        <h2><Glyph icon='list-unordered' /> Accounts</h2>
        <div style={{ flex: '1 1 auto' }}>
          {feed}
        </div>
      </Col>
    )
  }
}
