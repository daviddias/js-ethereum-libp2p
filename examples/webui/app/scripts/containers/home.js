import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Row, Col} from 'elemental'

import Blocks from '../components/blocks'
import Transactions from '../components/transactions'
import Peers from '../components/peers'
import Accounts from '../components/accounts'
import {pages} from '../actions'

class Home extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    leave: PropTypes.func.isRequired,
    blocks: PropTypes.array.isRequired,
    transactions: PropTypes.array.isRequired,
    peers: PropTypes.array.isRequired,
    accounts: PropTypes.array.isRequired
  };

  componentWillMount () {
    this.props.load()
  }

  componentWillUnmount () {
    this.props.leave()
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

export default connect(mapStateToProps, {
  ...pages.home
})(Home)
