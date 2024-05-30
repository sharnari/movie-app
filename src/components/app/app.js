import { React, Component } from 'react'
import { Flex } from 'antd'
import { parse, format } from 'date-fns'
import CardMovie from '../card'
import MovieService from "../../services/api-key"

import './app.css'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      MovieData: [
        {
          id: 0,
          title: "Returns",
          poster_path: 'no_image',
          description: 'no description',
          release_date: '0'
        }
      ],
      loading: true,
    }
  }

  componentDidMount() {
    this.getMoviesFromServer()
  }
  /*
  *
  */
  truncateDescription(desc, maxLength=205) {
    if (desc.length <= maxLength) {
      return desc;
    }
    return `${desc.slice(0, maxLength - 3)}...`;
  }

  /*
  * 
  */
  getMoviesFromServer = () => {
    const listInfoMovies = new MovieService()
    listInfoMovies.getResource("return").then((response) => { // отправляем запрос на поиск 'return'
      const movies = response.results // получаем тело ответа со списком фильмов
      let movieSlices = [] // Список для хранения отдельных даных
      movies.forEach((element, index) => {
        movieSlices.push({ // Заполняем этот список
          id: index,
          title: element.title,
          poster_path: MovieService.getImages(element.poster_path),
          description: element.overview,
          release_date: element.release_date,
        })
      });
      this.setState(() => {
         return {
           MovieData: movieSlices,
           loading: false,
         }
      })
    }).catch((error) => {
      console.log(error)
    })
  }

  /*
  * 
  */
  buildMoviesLayout = () => {
    // Задача, поменять в верстке названия фильмов на полученые отсервера:
    const listOfMovies = [] // Список карточек для фильмов
    for(let i = 0; i < 6; i++ ) {
      listOfMovies.push(<CardMovie
        title={this.state.MovieData[i].title}
        key={i}
        poster_path={this.state.MovieData[i].poster_path}
        description={this.truncateDescription(this.state.MovieData[i].description)}
        release_date={format(parse(this.state.MovieData[i].release_date, 'yyyy-MM-dd', new Date()), 'MMMM d, yyyy')}
        />) // Список заполнен + ключ
    }
    return listOfMovies
  }

  render () {
    if (this.state.loading) {
      return <div>Loading...</div>
    }
    const listOfMovie = this.buildMoviesLayout()
    return (
      <div className='app-content'>
        <Flex wrap gap={50} align="align" justify='center'>
          {listOfMovie}
        </Flex>
      </div>
    )
  }
}