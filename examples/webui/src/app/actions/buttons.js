import Block from 'ethereumjs-block'
import blocks from '../../../../../test/data/real-chain/first-1000-blocks.json'

const limitedBlocks = blocks.slice(1, 6)

export const SET_CURRENT_HEAD = 'SET_CURRENT_HEAD'

export function setCurrentHead (head) {
  return {
    type: SET_CURRENT_HEAD,
    head: head
  }
}

export function simulate () {
  return (dispatch, getState, getNode) => {
    return getNode.then((node) => {
      Promise.all(limitedBlocks.map((raw) => new Promise((resolve, reject) => {
        const block = new Block(new Buffer(raw.slice(2), 'hex'))
        node.vm._blockchain.putBlock(block, (err) => {
          if (err) {
            return reject(err)
          }
          resolve()
        })
      }))).then(() => new Promise((resolve, reject) => {
        node.vm.runBlockchain((err) => {
          if (err) {
            return reject(err)
          }
          resolve()
        })
      })).then(() => new Promise((resolve, reject) => {
        node.vm.blockchain.getHead((err, block) => {
          if (err) {
            return reject(err)
          }

          resolve(block)
        })
      })).then((block) => {
        const head = '0x' + node.vm._blockchain.meta.rawHead.toString('hex')
        dispatch(setCurrentHead(head))
      })
    })
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
