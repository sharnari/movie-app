import React from 'react'
import { Card } from 'antd';
import CardMovie from '../card';

import './app.css'
import Rectangle36 from './Rectangle36.png';

const App = () => {
  return (
    <div>
      <ul>
        <li>
        <Card className='card'
        styles={{
          body: {
            padding: 0,
          }
        }}
        >
          <div className='card__container'>
            <img className='card__image' src={Rectangle36} alt='movie poster'/>
          <div className='card__info'>
            <div className='card__title'>
              <h5>The way back</h5>
            </div>
            <div className='card__release'>
              <p>March 5, 2020</p> 
            </div>
            <div className='card__genre'>
            <ul>
              <li>Action</li>
              <li>Drama</li>
            </ul>
            </div>
            <div className='card__shortDescription'>
            A former basketball all-star, who has lost his wife and family foundation in a struggle with addiction attempts to regain his soul  and salvation by becoming the coach of a disparate ethnically mixed high ...
            </div>
          </div>
          </div>
        </Card>
        </li>
        <li>
          <CardMovie />
        </li>
      </ul>
    </div>
  )
}
export default App