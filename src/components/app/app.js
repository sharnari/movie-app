import { React, Component } from 'react'
import { Flex, Spin } from 'antd'
import { parse, format } from 'date-fns'

import CardMovie from '../card'
import InternetDown from '../internet-down'
import MovieService from '../../services/service'
import DataEmpty from '../no-data'

import './app.css'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      MovieData: [
        {
          id: 0,
          title: 'Returns',
          poster_path: 'no_image',
          description: 'no description',
          release_date: '0',
        },
      ],
      loading: true,
      error: false,
      empty: false,
    }
  }

  /*
   *
   */
  componentDidMount() {
    this.getMoviesFromServer()
  }
  /*
   *
   */
  truncateDescription(desc, maxLength = 205) {
    if (desc.length <= maxLength) {
      return desc
    }
    const words = desc.split(' ')
    let truncatedDesc = ''
    for (let word of words) {
      if ((truncatedDesc + word).length + 1 > maxLength) {
        break
      }
      truncatedDesc += (truncatedDesc ? ' ' : '') + word
    }
    return truncatedDesc + ' ...'
  }

  onError = () => {
    this.setState({
      error: true,
      loading: false,
      empty: true,
    })
  }

  /*
   *
   */
  getMoviesFromServer = () => {
    const listInfoMovies = new MovieService()
    listInfoMovies
      .getResource('anime')
      .then((response) => {
        // отправляем запрос на поиск 'return' ----------------------------------
        if (response.results.length === 0) {
          this.setState(() => {
            return {
              empty: true,
              loading: false,
            }
          })
        }
        const movies = response.results // получаем тело ответа со списком фильмов
        let movieSlices = [] // Список для хранения отдельных даных
        movies.forEach((element, index) => {
          movieSlices.push({
            // Заполняем этот список
            id: index,
            title: element.title,
            poster_path: MovieService.getImage(element.poster_path),
            description: element.overview,
            release_date: element.release_date,
          })
        })
        this.setState(() => {
          return {
            MovieData: movieSlices,
            loading: false,
          }
        })
      })
      .catch(() => {
        this.onError()
      })
  }

  /*
   * args: id
   * return: string
   * convert one string date format to another string date format
   * expample: "2011-02-10" to "February 10, 2011"
   */
  preparingDate = (id) => {
    const release = this.state.MovieData[id].release_date
    if (release === '') {
      return 'no date'
    }
    const newFormatOfDate = format(parse(release, 'yyyy-MM-dd', new Date()), 'MMMM d, yyyy')
    return newFormatOfDate
  }

  /*
   * args:
   * return: JSX array of CardMovie elements
   */
  buildMoviesLayout = () => {
    const listOfMovies = []
    for (let i = 0; i < 6; i++) {
      listOfMovies.push(
        <CardMovie
          title={this.state.MovieData[i].title}
          key={i}
          poster_path={this.state.MovieData[i].poster_path}
          description={this.truncateDescription(this.state.MovieData[i].description)}
          release_date={this.preparingDate(i)}
        />
      ) // Список заполнен + ключ
    }
    return listOfMovies
  }

  render() {
    const { loading, error, empty } = this.state
    if (loading) {
      return <LoadingPageView />
    }
    if (error) {
      return <InternetDown />
    }
    if (empty) {
      return <DataEmpty />
    }
    const listOfMovie = this.buildMoviesLayout()
    return <MoviesView movies={listOfMovie} />
  }
}

const MoviesView = ({ movies }) => {
  return (
    <div className="app-content">
      <Flex wrap gap={50} align="align" justify="center">
        {movies}
      </Flex>
    </div>
  )
}

const LoadingPageView = () => {
  return (
    <div className="loading-page">
      <Spin size="large" />
    </div>
  )
}
