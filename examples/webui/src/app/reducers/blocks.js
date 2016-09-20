import {blocks as actions} from '../actions'

const defaultState = {
  list: {
    '0x09': {
      status: 'received',
      block: {
        header: {
          parentHash: new Buffer('2ce94342df186bab4165c268c43ab982d360c9474f429fec5565adfc5d1f258b', 'hex'),
          uncleHash: new Buffer('1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347', 'hex'),
          coinbase: new Buffer('dd2f1e6e498202e86d8f5442af596580a4f03c2c', 'hex'),
          stateRoot: new Buffer('e208bde4aebc06bbd749674bee4b6ea7eb0c90b2bd950e2bc67f11b4669d93df', 'hex'),
          transactionsTrie: new Buffer('56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421', 'hex'),
          receiptTrie: new Buffer('56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421', 'hex'),
          bloom: new Buffer('00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'hex'),
          difficulty: new Buffer('03ff7fc008', 'hex'),
          number: new Buffer('09', 'hex'),
          gasLimit: new Buffer('1388', 'hex'),
          gasUsed: new Buffer('', 'hex'),
          timestamp: new Buffer('55ba42a3', 'hex'),
          extraData: new Buffer('476574682f76312e302e302d30636463373634372f6c696e75782f676f312e34', 'hex'),
          mixHash: new Buffer('75588cae5e63ea1ef3cebb72b06b983b5c18c078389d4a5134ac302181fd27b4', 'hex'),
          nonce: new Buffer('5b2575f3f38a1310', 'hex')
        },
        transactions: [],
        uncleHeaders: []
      }
    },
    '0x0a': {
      status: 'processed',
      block: {
        header: {
          parentHash: new Buffer('2ce94342df186bab4165c268c43ab982d360c9474f429fec5565adfc5d1f258b', 'hex'),
          uncleHash: new Buffer('1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347', 'hex'),
          coinbase: new Buffer('dd2f1e6e498202e86d8f5442af596580a4f03c2c', 'hex'),
          stateRoot: new Buffer('e208bde4aebc06bbd749674bee4b6ea7eb0c90b2bd950e2bc67f11b4669d93df', 'hex'),
          transactionsTrie: new Buffer('56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421', 'hex'),
          receiptTrie: new Buffer('56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421', 'hex'),
          bloom: new Buffer('00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'hex'),
          difficulty: new Buffer('03ff7fc008', 'hex'),
          number: new Buffer('0a', 'hex'),
          gasLimit: new Buffer('1388', 'hex'),
          gasUsed: new Buffer('', 'hex'),
          timestamp: new Buffer('55ba42a3', 'hex'),
          extraData: new Buffer('476574682f76312e302e302d30636463373634372f6c696e75782f676f312e34', 'hex'),
          mixHash: new Buffer('75588cae5e63ea1ef3cebb72b06b983b5c18c078389d4a5134ac302181fd27b4', 'hex'),
          nonce: new Buffer('5b2575f3f38a1310', 'hex')
        },
        transactions: [],
        uncleHeaders: []
      }
    }
  }
}

export default function blocks (state = defaultState, action) {
  const {type, status, block} = action
  switch (type) {
    case actions.ADD_BLOCK:
      return {
        ...state.list,
        ['0x' + block.number.toString('hex')]: {status, block}
      }
    default:
      return state
  }
}
