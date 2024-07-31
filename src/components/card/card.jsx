import { useState, useEffect, useContext } from 'react'
import { Card, Typography } from 'antd'
import PropTypes from 'prop-types'

import RateMovie from '../rate-movies'
import GenreContext from '../../provider/provider'
import './card.css'
import no_image from '../../assets/no_image.jpg'

const { Text } = Typography

const CardMovie = ({
  idMovie,
  guest_session_id,
  title,
  poster_path,
  description,
  release_date,
  rating,
  setLocalRate,
  vote_average,
  genre_ids,
}) => {
  const [rate, setRated] = useState(0)
  const genres = useContext(GenreContext)
  useEffect(() => {
    if (guest_session_id && rate > 0) {
      setLocalRate(idMovie, rate, guest_session_id)
    }
  }, [guest_session_id, rate, idMovie])

  const voteAverageBorderColor = (num) => {
    if (num < 3) {
      return '#E90000'
    } else if (num < 5) {
      return '#E97E00'
    } else if (num < 7) {
      return '#E9D100'
    } else {
      return '#66E900'
    }
  }

  const generateGenre = () => {
    let id = 0
    return genre_ids.map((element) => {
      const genre = genres.find((g) => +g.id === +element)
      if (genre) {
        return <li key={id++}>{genre.name}</li>
      }
      return null
    })
  }

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
          <div className="row">
            <div className="card__title">
              <h5>{title}</h5>
            </div>
            <div
              className="rated"
              style={{
                borderColor: voteAverageBorderColor(vote_average),
              }}
            >
              <Text
                style={{
                  fontSize: 29,
                }}
              >
                {vote_average}
              </Text>
            </div>
          </div>
          <div className="card__release">
            <p>{release_date}</p>
          </div>
          <div className="card__genre">
            <ul>{generateGenre()}</ul>
          </div>
          <div className="card__shortDescription">{description}</div>
          <div className="rate">
            <RateMovie setRated={setRated} rate={rating ? rating : rate} />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default CardMovie

CardMovie.propTypes = {
  idMovie: PropTypes.number,
  guest_session_id: PropTypes.string,
  title: PropTypes.string.isRequired,
  poster_path: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  description: PropTypes.string.isRequired,
  release_date: PropTypes.string,
  rating: PropTypes.number,
  setLocalRate: PropTypes.func,
  vote_average: PropTypes.string,
  genre_ids: PropTypes.arrayOf(PropTypes.number),
  genres: PropTypes.arrayOf(PropTypes.object),
}
