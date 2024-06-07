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

export default class ServiceMovie {
  baseURL = 'https://api.themoviedb.org/3/'
  API_KEY = '3df31dd598e29136b5eda03d5ca6df8e'

  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZGYzMWRkNTk4ZTI5MTM2YjVlZGEwM2Q1Y2E2ZGY4ZSIsInN1YiI6IjY2NTBkNmQ1ZWU4MmI0NWViMjI2Yjg2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.n3WGPv0IepwZRmqDkmUjjq4-D7VjSA-yIOYm10PNBXA',
    },
  }

  async getResource(text) {
    const queryURL = `${this.baseURL}search/movie?`
    const res = await fetch(`${queryURL}query=${text}`, this.options)
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
}
