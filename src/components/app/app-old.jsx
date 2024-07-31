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
import GenreContext from '../../provider/provider'

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
      MovieDataRated: [],
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
      guesSessId: null,
      genres: null,
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
      this.setState(
        {
          guesSessId: res['guest_session_id'],
        },
        () => {
          this.getMoviesFromServer(movieName)
        }
      )
    })
    this.listInfoMovies.getGenre().then((res) => {
      this.setState({
        genres: res.genres,
      })
    })
  }

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
        // отправляем запрос на поиск фильмов
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
        movies.forEach((element) => {
          movieSlices.push({
            // Заполняем этот список
            id: element.id,
            title: element.title,
            poster_path: MovieService.getImage(element.poster_path),
            description: element.overview,
            release_date: element.release_date,
            rating: this.state.MovieDataRated.find((el) => el.idMovie === element.id)?.rate,
            vote_average: element.vote_average.toFixed(1),
            genre_ids: element.genre_ids,
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
      .catch((error) => {
        console.error(error)
        this.onError()
      })
  }

  getShortRatedMovies = () => {
    const { guesSessId } = this.state
    if (!guesSessId) {
      return
    }
    this.listInfoMovies
      .getMyRatedMovies(guesSessId)
      .then((res) => {
        const total_pages = res.total_pages
        const movies = res.results
        const movieSlices = []
        movies.forEach((element) => {
          movieSlices.push({
            id: element.id,
            title: element.title,
            poster_path: MovieService.getImage(element.poster_path),
            description: element.overview,
            release_date: element.release_date,
            vote_average: element['vote_average'].toFixed(1),
            rating: element.rating,
            genre_ids: element.genre_ids,
          })
        })
        this.setState(() => {
          return {
            MovieData: movieSlices,
            loading: false,
            total_pages: total_pages,
            currentPage: 1,
            islistRatedMovie: true,
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
    const { MovieData, guesSessId, genres } = this.state
    return MovieData.map((movie, i) => (
      <CardMovie
        idMovie={movie.id}
        guest_session_id={guesSessId}
        key={movie.id}
        title={movie.title}
        poster_path={movie.poster_path}
        description={this.truncateDescription(movie.description)}
        release_date={this.preparingDate(i)}
        rating={movie.rating}
        setLocalRate={this.setLocalRate}
        vote_average={movie.vote_average}
        genre_ids={movie.genre_ids}
        genres={genres}
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
    const { searchQuery, currentPage } = this.state
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
        islistRatedMovie: false,
      })
      this.getMoviesFromServer(searchQuery, currentPage)
    }
  }

  setLocalRate = (idMovie, rate, guest_session_id) => {
    this.listInfoMovies
      .setRate(idMovie, rate, guest_session_id)
      .then(() => {
        const newMovie = { idMovie, rate }
        this.setState(({ MovieDataRated }) => {
          const newData = [...MovieDataRated, newMovie]
          return {
            MovieDataRated: newData,
          }
        })
      })
      .catch((error) => {
        console.error('Error setting rate:', error)
      })
  }

  render() {
    const { error, total_pages, tabItem, rated, islistRatedMovie, genres } = this.state
    if (error) {
      return <InternetDown />
    }
    return (
      <GenreContext.Provider value={genres}>
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
          <Leaf
            onChange={(page) => this.changePage(page)}
            currentPage={this.state.currentPage}
            total_pages={total_pages}
          />
        </div>
      </GenreContext.Provider>
    )
  }
}
