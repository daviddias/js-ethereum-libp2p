const ethereum = require('../../../../src')
const utils = require('../../../../test/utils')

const node = new ethereum.Node()

node.start((err) => {
  console.log('node has started and connected connected')
})

function runSimulation () {
  // TODO
  //   Generate blocks
  //   Process them
  //   Visualize
  //     blocks coming in
  //     vm state (green or red)
  //     state of the accounts
}

function connectToTheNetwork () {
  // TODO
    // dial to the relay node
    // get all the blocks
}
