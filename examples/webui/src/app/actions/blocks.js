export const ADD_BLOCK = 'ADD_BLOCK'

export function addBefore (block) {
  return {
    type: ADD_BLOCK,
    block: block,
    status: 'received'
  }
}

export function addAfter (block) {
  return {
    type: ADD_BLOCK,
    block: block,
    status: 'processed'
  }
}
