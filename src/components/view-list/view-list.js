import React from 'react'
import { Flex } from 'antd'

import './view-list.css'

const MoviesView = ({ movies }) => {
  return (
    <div className="margin-bM">
      <Flex wrap gap={50} align="align" justify="space-around">
        {movies}
      </Flex>
    </div>
  )
}

export default MoviesView
