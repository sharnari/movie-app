import { Component } from 'react'
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
import ErrorAlert from '../error-alert'
import { Provider } from '../../provider/provider'

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
      tabItem: [
        {
          label: 'Search',
          key: '1',
        },
        {
          label: 'Rated',
          key: '2',
        },
      ],
      rated: false,
      loading: true,
      error: false,
      empty: false,
      searchQuery: '',
      total_pages: 1,
      currentPage: 1,
      islistRatedMovie: false,
    }
    this.debouncedGetMovies = debounce(this.getMoviesFromServer, 1000)
    this.listInfoMovies = new MovieService()
  }

  /*
   * Executes a request to the server, immediately after the component is rendered
   */
  componentDidMount() {
    const movieName = this.state.searchQuery
    this.listInfoMovies.getGuestSession().then((res) => {
      this.guesSessId = res['guest_session_id']
      console.log(this.guesSessId)
    }) // получаем результат с guest_session_id
    this.getMoviesFromServer(movieName)
    this.setState({
      searchQuery: movieName,
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
  truncateDescription(desc, maxLength = 180) {
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
    this.listInfoMovies
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

  getShortRatedMovies = () => {
    console.log(this.guesSessId)
    this.listInfoMovies
      .getMyRatedMovies(this.guesSessId)
      .then((res) => {
        const total_pages = res.total_pages
        const movies = res.results
        console.log(res)
        const movieSlices = []
        movies.forEach((element, index) => {
          movieSlices.push({
            id: index,
            title: element.title,
            poster_path: MovieService.getImage(element.poster_path),
            description: element.overview,
            release_date: element.release_date,
            rate: element['vote_average'].tofixed(1),
            myRate: element.rating,
          })
        })
        this.setState(() => {
          return {
            MovieData: movieSlices,
            loading: false,
            total_pages: total_pages,
            currentPage: 1,
          }
        })
      })
      .catch(() => {
        return <ErrorAlert />
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
      return <MoviesView style={{ flex: 1 }} movies={listOfMovie} />
    }
  }

  changePage = (page) => {
    const query = this.state.searchQuery
    this.getMoviesFromServer(query, page)
  }

  switchMenu = (key) => {
    if (key === '2') {
      this.setState({
        rated: true,
        MovieData: [],
        total_pages: 1,
        currentPage: 1,
      })
      this.getShortRatedMovies()
    } else {
      this.setState({
        rated: false,
      })
      this.getMoviesFromServer(this.state.searchQuery, 1)
    }
  }

  render() {
    const { error, total_pages, /*currentPage,*/ tabItem, rated, islistRatedMovie } = this.state
    if (error) {
      return <InternetDown />
    }
    return (
      <Provider value={this.state.currentPage}>
        <div className="app-content">
          <Selector item={tabItem} onChange={this.switchMenu} />
          {rated ? (
            islistRatedMovie ? (
              <></>
            ) : (
              <ErrorAlert className="alert-message" />
            )
          ) : (
            <Search
              handleSearchChange={this.handleSearchChange}
              value={this.state.searchQuery}
              defaultValue={this.state.searchQuery}
            />
          )}
          {this.selectView()}
          <Leaf onChange={(page) => this.changePage(page)} total_pages={total_pages} /*currentPage={currentPage}*/ />
        </div>
      </Provider>
    )
  }
}
