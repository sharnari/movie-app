import { React, Component } from 'react'
import { Flex } from 'antd'
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
          title: "Returns"
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
  getMoviesFromServer = () => {
    const listInfoMovies = new MovieService()
    listInfoMovies.getResource("return").then((response) => { // отправляем запрос на поиск 'return'
      const movies = response.results // получаем тело ответа со списком фильмов
      let movieSlices = [] // Список для хранения отдельных даных.
      movies.forEach((element, index) => {
        movieSlices.push({ // Заполняем этот список
          id: index,
          title: element.title,
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
        key={i} />) // Список заполнен + ключ
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