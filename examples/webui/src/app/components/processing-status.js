import React from 'react'
import {Glyph} from 'elemental'

export default function ProcessingStatus ({status}) {
  let type = 'default'
  if (status === 'received') {
    type = 'warning'
  }

  if (status === 'processed') {
    type = 'success'
  }

  return (
    <Glyph icon='primitive-dot' type={type} />
  )
}
