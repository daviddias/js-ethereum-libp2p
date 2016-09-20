import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Row, Col, Button, ButtonGroup} from 'elemental'
import classNames from 'classnames'

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
        <ButtonGroup>
          <Button type='hollow-primary' onClick={this.props.simulate} >
            Simulation
          </Button>
          <Button type='hollow-primary' onClick={this.props.sync} >
            Sync
          </Button>
          <Button type='hollow-primary' onClick={this.props.star} >
            Star
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
