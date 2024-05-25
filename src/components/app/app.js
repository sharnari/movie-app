import React from 'react'
import { Flex } from 'antd'
import CardMovie from '../card'

import './app.css'

const App = () => {
  let listOfMovie = []
  for(let i = 0; i <= 6; i++ ) {
     listOfMovie.push(<CardMovie />)     
  }

  return (
    <div className='app-content'>
      <Flex wrap gap={50} align="align" justify='center'>
        {listOfMovie}
        <CardMovie />
      </Flex>
    </div>
  )
}
export default App