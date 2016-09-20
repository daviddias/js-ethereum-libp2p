import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Row, Col, Button, ButtonGroup, Glyph} from 'elemental'

import {buttons} from '../actions'

class Home extends Component {
  static propTypes = {
    simulate: PropTypes.func.isRequired,
    sync: PropTypes.func.isRequired,
    star: PropTypes.func.isRequired
  };

  render () {
    return (
      <Col sm='1' className='action-buttons'>
        <h2 className='title'>
          libp2p <Glyph icon='heart' type='danger' /> ethereum
        </h2>
        <ButtonGroup>
          <Button type='hollow-primary' onClick={this.props.simulate} >
            Simulation
          </Button>
          <Button type='hollow-primary' onClick={this.props.sync} >
            Sync
          </Button>
          <Button type='hollow-primary' onClick={this.props.star} >
            <Glyph icon='star' type='primary' />
          </Button>
        </ButtonGroup>
      </Col>
    )
  }
}

function mapStateToProps (state) {
  return {}
}

export default connect(mapStateToProps, {
  simulate: buttons.simulate,
  sync: buttons.sync,
  star: buttons.star
})(Home)
