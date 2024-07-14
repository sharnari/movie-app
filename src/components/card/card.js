import React from 'react'
import { Card } from 'antd'
import PropTypes from 'prop-types'

import RateMovie from '../rate-movies'

import './card.css'
import no_image from './no_image.jpg'

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
        <div className="card__image">
          <img src={poster_path === null ? no_image : poster_path} alt="movie poster" />
        </div>
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
          <div className="rate">
            <RateMovie />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default CardMovie

CardMovie.propTypes = {
  title: PropTypes.string.isRequired,
  poster_path: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]).isRequired,
  description: PropTypes.string.isRequired,
  release_date: PropTypes.string,
}
