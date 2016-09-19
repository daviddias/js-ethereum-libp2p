import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Row, Col} from 'elemental'

import Blocks from '../components/blocks'
import Transactions from '../components/transactions'
import Peers from '../components/peers'
import Accounts from '../components/accounts'
import {home} from '../actions'

class Home extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    blocks: PropTypes.object.isRequired,
    transactions: PropTypes.object.isRequired,
    peers: PropTypes.array.isRequired,
    accounts: PropTypes.object.isRequired
  };

  componentWillMount () {
    this.props.dispatch(home.start())
  }

  componentWillUnmount () {
    this.props.dispatch(home.stop())
  }

  render () {
    return (
      <Row className='top-row'>
        <Col sm='1' md='1/3' lg='1/3' className='feed'>
          <Accounts feed={this.props.accounts} />
          <Peers feed={this.props.peers} />
        </Col>
        <Blocks feed={this.props.blocks} />
        <Transactions feed={this.props.transactions} />
      </Row>
    )
  }
}

function mapStateToProps (state) {
  const {blocks, transactions, peers, accounts} = state

  return {
    blocks: blocks.list,
    transactions: transactions.list,
    peers: peers.list,
    accounts: accounts.list
  }
}

export default connect(mapStateToProps)(Home)
