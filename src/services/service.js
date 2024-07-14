// export default class MovieService {
//   API_KEY = '3df31dd598e29136b5eda03d5ca6df8e'
//   options = {
//     method: 'GET',
//     headers: {
//       accept: 'application/json',
//     },
//   };
//   baseUrl = 'https://api.themoviedb.org/3';

//   async getResource(searchText, page = 1) {
//     const response = await fetch(
//       `${this.baseUrl}/search/movie?api_key=${this.API_KEY}&query=${searchText}&page=${page}`,
//       this.options);
//     if (!response.ok) {
//       throw new Error(`could not featch, received ${response.status}`);
//     }
//     return await response.json();
//   }
// }

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
  // https://developers.themoviedb.org/3/authentication/create-guest-session
  async getGuestSession() {
    const queryURL = `${this.baseURL}authentication/guest_session/new?api_key=${this.API_KEY}`
    const res = await fetch(`${queryURL}`, this.options)
    if (!res.ok) {
      throw new Error(`Could not fetch ${queryURL} received ${res.state}`)
    }
    return await res.json()
  }

  async getResource(text, page = 1) {
    const queryURL = `${this.baseURL}search/movie?`
    const res = await fetch(`${queryURL}query=${text}&page=${page}`, this.options)
    if (!res.ok) {
      throw new Error(`Could not fetch ${queryURL} received ${res.state}`)
    }
    return await res.json()
  }

  static getImage(poster_path) {
    if (poster_path === null) {
      return poster_path
    }
    return `https://image.tmdb.org/t/p/w500${poster_path}`
  }
  // https://developers.themoviedb.org/3/guest-sessions/get-guest-session-rated-movies
  async getMyRatedMovies(guest_session_id) {
    const queryURL = `${this.baseURL}guest_session/${guest_session_id}/rated/movies?language=en-US&page=1&sort_by=created_at.asc`
    const res = await fetch(queryURL, this.options)
    if (!res.ok) {
      throw new Error(`Could not fetch ${queryURL} received ${res.state}`)
    }
    return await res.json()
  }
}
