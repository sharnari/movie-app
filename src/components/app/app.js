import { React, Component } from 'react'
import { parse, format } from 'date-fns'
import debounce from 'lodash/debounce'

import CardMovie from '../card'
import InternetDown from '../internet-down'
import MovieService from '../../services/service'
import DataEmpty from '../no-data'
import Search from '../search'
import Selector from '../menu'
import MoviesView from '../view-list'
import LoadingPageView from '../loading-view'
import Leaf from '../pagination'

import './app.css'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      MovieData: [
        {
          id: 0,
          title: '',
          poster_path: '',
          description: '',
          release_date: '',
        },
      ],
      loading: true,
      error: false,
      empty: false,
      searchQuery: '',
    }
    this.debouncedGetMovies = debounce(this.getMoviesFromServer, 1000)
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
  getMoviesFromServer = (query = 'return', page) => {
    this.setState({
      loading: true,
      error: false,
      empty: false,
    })
    const listInfoMovies = new MovieService()
    listInfoMovies
      .getResource(query, page)
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
    const release = this.state.MovieData[id]?.release_date
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
    const { MovieData } = this.state
    return MovieData.slice(0, 6).map((movie, i) => (
      <CardMovie
        key={i}
        title={movie.title}
        poster_path={movie.poster_path}
        description={this.truncateDescription(movie.description)}
        release_date={this.preparingDate(i)}
      />
    ))
  }

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value }, () => {
      this.debouncedGetMovies(this.state.searchQuery)
    })
  }

  selectView = () => {
    const { loading, empty, MovieData } = this.state
    if (loading) {
      return <LoadingPageView />
    } else if (empty || MovieData.length === 0) {
      return <DataEmpty />
    } else {
      const listOfMovie = this.buildMoviesLayout()
      return <MoviesView movies={listOfMovie} />
    }
  }

  changePage = (page) => {
    console.log(`${page}`)
  }

  render() {
    const { error } = this.state
    if (error) {
      return <InternetDown />
    }
    return (
      <div className="app-content">
        <Selector />
        <Search handleSearchChange={this.handleSearchChange} value={this.state.searchQuery} />
        {this.selectView()}
        <Leaf onChangePage={(page) => this.changePage()} />
      </div>
    )
  }
}
