import ethereum from '../../../../../src'

export function createNode () {
  const node = new ethereum.Node()
  return new Promise((resolve, reject) => {
    node.start((err) => {
      if (err) {
        return reject(err)
      }
      resolve(node)
    })
  })
}
