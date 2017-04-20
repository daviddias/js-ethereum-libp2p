import React from 'react'

export default function Hash ({value, length = 16}) {
  return (
    <span className='hash'>
      {value.toString('hex').substring(0, 16)}...
    </span>
  )
}
