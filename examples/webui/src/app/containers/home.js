import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Row} from 'elemental'

import Blocks from '../components/blocks'
import Peers from '../components/peers'
import Accounts from '../components/accounts'
import {home} from '../actions'
import ActionButtons from './action-buttons'

class Home extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    blocks: PropTypes.array.isRequired,
    peers: PropTypes.array.isRequired,
    accounts: PropTypes.array.isRequired
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
        <ActionButtons />
        <Peers feed={this.props.peers} />
        <Blocks feed={this.props.blocks} />
        <Accounts feed={this.props.accounts} />
      </Row>
    )
  }
}

function mapStateToProps (state) {
  const {blocks, peers, accounts} = state

  return {
    blocks: blocks.list,
    peers: peers.list,
    accounts: accounts.list
  }
}

export default connect(mapStateToProps)(Home)
