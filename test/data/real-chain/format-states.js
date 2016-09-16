/*
 * Script to format
 * the genesis state - https://raw.githubusercontent.com/ethereumjs/common/master/genesisState.json
 */

const states = require('./states')
const newPre = {}

Object.keys(states.pre)
      .forEach((accountAddr) => {
        newPre[accountAddr] = {
          balance: states.pre[accountAddr],
          code: '0x',
          nonce: '0x00',
          storage: {}
        }
      })

require('fs').writeFileSync(__dirname + '/new-states.json', JSON.stringify(newPre, 2))
