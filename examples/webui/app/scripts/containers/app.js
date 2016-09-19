import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {errors} from '../actions'

class App extends Component {
  static propTypes = {
    // Injected by React Redux
    errorMessage: PropTypes.string,
    resetErrorMessage: PropTypes.func.isRequired,
    // Injected by React Router
    children: PropTypes.node,
    params: PropTypes.object,
    location: PropTypes.object
  };

  render () {
    const {children} = this.props

    return (
      <div className='page-wrapper'>
        <div className='page-body'>
          <div className='page-body-inner'>
            {children}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    errorMessage: state.errors
  }
}

export default connect(mapStateToProps, {
  resetErrorMessage: errors.resetErrorMessage
})(App)
