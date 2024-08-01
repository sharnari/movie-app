export default class MovieService {
  baseURL = 'https://api.themoviedb.org/3/'
  API_KEY = '3df31dd598e29136b5eda03d5ca6df8e'
  API_TOKEN =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZGYzMWRkNTk4ZTI5MTM2YjVlZGEwM2Q1Y2E2ZGY4ZSIsIm5iZiI6MTcyMDEwNjE5OS44OTEwNjQsInN1YiI6IjY2NTBkNmQ1ZWU4MmI0NWViMjI2Yjg2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hr3cwr5_F7BLkfAAE0AbLIkK0UVotAxotcjldb6hS6o'

  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${this.API_TOKEN}`,
    },
  }

  async getGuestSession() {
    const queryURL = `${this.baseURL}authentication/guest_session/new?api_key=${this.API_KEY}`
    const res = await fetch(`${queryURL}`, this.options)
    if (!res.ok) {
      throw new Error(`Could not fetch ${queryURL} received ${res.status}`)
    }
    return await res.json()
  }

  async getResource(text, page = 1) {
    const queryURL = `${this.baseURL}search/movie?`
    const res = await fetch(`${queryURL}query=${text}&page=${page}`, this.options)
    if (!res.ok) {
      throw new Error(`Could not fetch ${queryURL} received ${res.status}`)
    }
    return await res.json()
  }

  static getImage(poster_path) {
    if (poster_path === null) {
      return poster_path
    }
    return `https://image.tmdb.org/t/p/w500${poster_path}`
  }

  async getMyRatedMovies(guest_session_id) {
    const queryURL = `${this.baseURL}guest_session/${guest_session_id}/rated/movies?language=en-US&page=1&sort_by=created_at.asc`
    const res = await fetch(queryURL, this.options)
    if (!res.ok) {
      throw new Error(`Could not fetch ${queryURL} received ${res.status}`)
    }
    return await res.json()
  }

  async setRate(idMovie, rate, keyGuestSession) {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${this.API_TOKEN}`,
      },
      body: JSON.stringify({ value: rate }),
    }
    const queryURL = `${this.baseURL}movie/${idMovie}/rating?guest_session_id=${keyGuestSession}`
    const res = await fetch(queryURL, options)
    if (!res.ok) {
      throw new Error(`Could not fetch ${queryURL} received ${res.status}`)
    }
    const returnData = await res.json()
    return returnData
  }

  async getGenre() {
    const queryURL = `${this.baseURL}/genre/movie/list?language=en`
    const res = await fetch(queryURL, this.options)
    if (!res.ok) {
      throw new Error(`Could not fetch ${queryURL} received ${res.status}`)
    }
    const allGenres = await res.json()
    return allGenres
  }

  saveGenres(res = []) {
    this.genres = res
  }
}
// const guest = new MovieService()
// guest.getGuestSession().then((res) => {
//   guest.setRate(15,10, res.guest_session_id).then((res) => {
//     console.log(res)
//   })
// })
