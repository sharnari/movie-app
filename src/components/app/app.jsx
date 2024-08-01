import { useCallback, useEffect, useState } from 'react'
import { parse, format } from 'date-fns'
import debounce from 'lodash/debounce'

import CardMovie from '../card'
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

const App = () => {
  const [MovieData, setMovieData] = useState([])
  const [MovieDataRated, setMovieDataRated] = useState([])
  const [tabItem] = useState([
    {
      label: 'Search',
      key: '1',
    },
    {
      label: 'Rated',
      key: '2',
    },
  ])
  const [rated, setRated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [total_pages, setTotal_pages] = useState(1)
  // const [islistRatedMovie, setIslistRatedMovie] = useState(false)
  const [guesSessId, setGuesSessId] = useState(null)
  const [genres, setGenres] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const movieService = new MovieService()

  const getMoviesFromServer = useCallback(
    (query = searchQuery, page = 1) => {
      setLoading(true)
      setError(false)
      setEmpty(false)
      movieService
        .getResource(query, page)
        .then((response) => {
          // отправляем запрос на поиск фильмов
          if (response.results.length === 0) {
            setEmpty(true)
            setLoading(false)
            setTotal_pages(1)
            setCurrentPage(1)
            return
          }
          const total_pages = response.total_pages
          const movies = response.results.map((element) => ({
            id: element.id,
            title: element.title,
            poster_path: MovieService.getImage(element.poster_path),
            description: element.overview,
            release_date: element.release_date,
            rating: MovieDataRated.find((el) => el.idMovie === element.id)?.rate,
            vote_average: element.vote_average.toFixed(1),
            genre_ids: element.genre_ids,
          })) // получаем тело ответа со списком фильмов
          setMovieData(movies)
          setLoading(false)
          setTotal_pages(total_pages)
          setCurrentPage(page)
        })
        .catch((error) => {
          onError(error)
        })
    },
    [searchQuery, MovieDataRated]
  )

  const debouncedGetMovies = useCallback(debounce(getMoviesFromServer, 1000), [getMoviesFromServer])

  useEffect(() => {
    const savedGuestSessId = localStorage.getItem('guest_session_id')
    if (savedGuestSessId) {
      setGuesSessId(savedGuestSessId)
      movieService
        .getGenre()
        .then((res) => {
          setGenres(res.genres)
        })
        .catch(() => {
          onError(error)
        })
      getMoviesFromServer(searchQuery)
    } else {
      movieService
        .getGuestSession()
        .then((res) => {
          const newGuestSessId = res['guest_session_id']
          setGuesSessId(newGuestSessId)
          localStorage.setItem('guest_session_id', newGuestSessId)
          movieService.getGenre().then((res) => {
            setGenres(res.genres)
          })
          getMoviesFromServer(searchQuery)
        })
        .catch((error) => onError(error))
    }
    return () => {
      debouncedGetMovies.cancel()
    }
  }, [])

  useEffect(() => {
    if (searchQuery) {
      debouncedGetMovies(searchQuery)
    }
    return () => {
      debouncedGetMovies.cancel()
    }
  }, [searchQuery])

  /*
   * args: desc(string), maxLength(number)
   * return: string
   * trim text - desc by words up to maxLength characters
   */
  const truncateDescription = (desc, maxLength = 180) => {
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

  const onError = (error) => {
    setError(true)
    setLoading(false)
    setEmpty(true)
    setErrorMessage(error.message)
  }

  const getShortRatedMovies = () => {
    if (!guesSessId) {
      return
    }
    movieService
      .getMyRatedMovies(guesSessId)
      .then((res) => {
        const total_pages = res.total_pages
        const movies = res.results.map((element) => ({
          id: element.id,
          title: element.title,
          poster_path: MovieService.getImage(element.poster_path),
          description: element.overview,
          release_date: element.release_date,
          vote_average: element['vote_average'].toFixed(1),
          rating: element.rating,
          genre_ids: element.genre_ids,
        }))
        setMovieData(movies)
        setLoading(false)
        setTotal_pages(total_pages)
        setCurrentPage(1)
        // setIslistRatedMovie(true)
      })
      .catch((error) => {
        onError(error)
      })
  }

  const preparingDate = (id) => {
    const release = MovieData[id]?.release_date
    if (release === '') {
      return 'no data'
    }
    return format(parse(release, 'yyyy-MM-dd', new Date()), 'MMMM d, yyyy')
  }

  const buildMoviesLayout = () => {
    return MovieData.map((movie, i) => (
      <CardMovie
        idMovie={movie.id}
        guest_session_id={guesSessId}
        key={movie.id}
        title={movie.title}
        poster_path={movie.poster_path}
        description={truncateDescription(movie.description)}
        release_date={preparingDate(i)}
        rating={movie.rating}
        setLocalRate={setLocalRate}
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
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
    // debouncedGetMovies(searchQuery)
  }

  /*
   * args: event
   * return: JSX element
   * selects the layout to be called on the page
   */
  const selectView = () => {
    if (loading) {
      return <LoadingPageView />
    } else if (empty || MovieData.length === 0) {
      return <DataEmpty />
    } else {
      return <MoviesView style={{ flex: 1 }} movies={buildMoviesLayout()} />
    }
  }

  const changePage = (page) => {
    getMoviesFromServer(searchQuery, page)
  }

  const switchMenu = (key) => {
    if (key === '2') {
      setRated(true)
      setMovieData([])
      setTotal_pages(1)
      setCurrentPage(1)
      getShortRatedMovies()
    } else {
      setRated(false)
      // setIslistRatedMovie(false)
      getMoviesFromServer(searchQuery, currentPage)
    }
  }

  const setLocalRate = (idMovie, rate, guest_session_id) => {
    movieService
      .setRate(idMovie, rate, guest_session_id)
      .then(() => {
        const newMovie = { idMovie, rate }
        setMovieDataRated([...MovieDataRated, newMovie])
      })
      .catch((error) => {
        onError(error)
      })
  }

  const handleAlertClose = () => {
    setError(false)
  }

  // if (error) {
  //   // return <InternetDown />
  // }
  return (
    <GenreContext.Provider value={genres}>
      <div className="app-content">
        <Selector item={tabItem} onChange={switchMenu} />
        {rated ? (
          errorMessage ? (
            <></>
          ) : (
            <></>
          )
        ) : (
          <Search handleSearchChange={handleSearchChange} value={searchQuery} defaultValue={searchQuery} />
        )}
        {selectView()}
        <Leaf onChange={changePage} currentPage={currentPage} total_pages={total_pages * 10} />
        {error && <ErrorAlert errorMessage={errorMessage} onClose={handleAlertClose} />}
      </div>
    </GenreContext.Provider>
  )
}

export default App
