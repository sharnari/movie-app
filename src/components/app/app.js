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
      total_pages: 1,
      currentPage: 1,
    }
    this.debouncedGetMovies = debounce(this.getMoviesFromServer, 1000)
  }
  totalMovie = 'return'

  /*
   * Executes a request to the server, immediately after the component is rendered
   */
  componentDidMount() {
    const totalMovie = this.totalMovie
    this.getMoviesFromServer(this.totalMovie)
    this.setState({
      searchQuery: totalMovie,
    })
  }

  /*
   *
   *
   */
  componentWillUnmount() {
    this.debouncedGetMovies.cancel()
  }

  /*
   * args: desc(string), maxLength(number)
   * return: string
   * trim text - desc by words up to maxLength characters
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

  /*
   * configures the error state
   */
  onError = () => {
    this.setState({
      error: true,
      loading: false,
      empty: true,
    })
  }

  /*
   * args: query, page
   * makes a request to the server, filters the data and updates the state of the component
   */
  getMoviesFromServer = (query = this.state.searchQuery, page = 1) => {
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
        const total_pages = response.total_pages
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
            total_pages: total_pages,
            currentPage: page,
          }
        })
      })
      .catch(() => {
        this.onError()
      })
  }

  /*
   * args: id(number)
   * return: string of date(string)
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
   * return: JSX array of CardMovie elements
   * builds an array with JSX cards
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

  /*
   * args: event
   * updates the query in the state of the component
   */
  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value }, () => {
      this.debouncedGetMovies(this.state.searchQuery)
    })
  }

  /*
   * args: event
   * return: JSX element
   * selects the layout to be called on the page
   */
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
    const query = this.state.searchQuery
    this.getMoviesFromServer(query, page)
  }

  render() {
    const { error, total_pages, currentPage } = this.state
    if (error) {
      return <InternetDown />
    }
    return (
      <div className="app-content">
        <Selector />
        <Search
          handleSearchChange={this.handleSearchChange}
          value={this.state.searchQuery}
          defaultValue={this.totalMovie}
        />
        {this.selectView()}
        <Leaf onChange={(page) => this.changePage(page)} total_pages={total_pages} currentPage={currentPage} />
      </div>
    )
  }
}
