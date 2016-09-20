import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Row, Col, Button, ButtonGroup, Glyph, Spinner} from 'elemental'

import {buttons} from '../actions'
import Hash from '../components/hash'

class ActionButtons extends Component {
  static propTypes = {
    simulate: PropTypes.func.isRequired,
    sync: PropTypes.func.isRequired,
    star: PropTypes.func.isRequired,
    head: PropTypes.string,
    processing: PropTypes.shape({
      simulate: PropTypes.bool.isRequired,
      sync: PropTypes.bool.isRequired,
      star: PropTypes.bool.isRequired
    }).isRequired
  };

  _onClick = (prop) => {
    return () => {
      this.props[prop]()
    }
  }

  render () {
    let head

    if (this.props.head) {
      head = (
        <h3 className='current-head'>
          <em>Head</em> <Hash value={this.props.head} />
        </h3>
      )
    }
    return (
      <Col sm='1' className='action-buttons'>
        <h2 className='title'>
          libp2p <Glyph icon='heart' type='danger' /> ethereum
        </h2>
        <ButtonGroup>
          <Button type='hollow-primary' onClick={this._onClick('simulate')} >
            {this.props.processing.simulate ?
             <Spinner type='primary' /> :
             'Simulation'
            }
          </Button>
          <Button type='hollow-primary' onClick={this._onClick('sync')} >
            {this.props.processing.sync ?
             <Spinner type='primary' /> :
             'Sync'
            }
          </Button>
          <Button type='hollow-primary' onClick={this._onClick('star')} >
            {this.props.processing.star ?
             <Spinner type='primary' /> :
             <Glyph icon='star' type='primary' />
            }
          </Button>
        </ButtonGroup>
        {head}
      </Col>
    )
  }
}

function mapStateToProps (state) {
  return {
    head: state.head,
    processing: state.processing
  }
}

export default connect(mapStateToProps, {
  simulate: buttons.simulate,
  sync: buttons.sync,
  star: buttons.star
})(ActionButtons)
