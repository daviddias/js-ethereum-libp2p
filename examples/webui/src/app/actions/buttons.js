export function simulate () {
  return (dispatch) => {
    console.log('SIMULATING')
    return Promise.resolve()
  }
}

export function sync () {
  return (dispatch) => {
    console.log('SYNCING')
    return Promise.resolve()
  }
}

export function star () {
  return (dispatch) => {
    console.log('STARING')
    return Promise.resolve()
  }
}
