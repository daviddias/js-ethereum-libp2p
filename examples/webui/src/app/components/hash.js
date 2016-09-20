import React from 'react'

export default function Hash ({value, length = 16}) {
  return (
    <code className='hash'>
      {value.toString('hex').substring(0, 16)}...
    </code>
  )
}
