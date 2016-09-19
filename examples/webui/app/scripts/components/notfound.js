import React from 'react'
import {Link} from 'react-router'

export default function NotFound () {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>
        <Link to='/'>
          Go to console home
        </Link>
      </p>
    </div>
  )
}
