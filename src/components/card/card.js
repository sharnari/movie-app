import React from 'react'
import { Card } from 'antd'

import './card.css'
import no_image from './no_image.png'

const CardMovie = ({ title, poster_path, description, release_date }) => {
  return (
    <Card
      className="card"
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <div className="card__container">
        <img className="card__image" src={poster_path === null ? no_image : poster_path} alt="movie poster" />
        <div className="card__info">
          <div className="card__title">
            <h5>{title}</h5>
          </div>
          <div className="card__release">
            <p>{release_date}</p>
          </div>
          <div className="card__genre">
            <ul>
              <li>Action</li>
              <li>Drama</li>
            </ul>
          </div>
          <div className="card__shortDescription">{description}</div>
        </div>
      </div>
    </Card>
  )
}

export default CardMovie
