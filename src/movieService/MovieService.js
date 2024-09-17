class MovieService {
  apiKey = '755cdc908720084432416c215082f64f';
  baseUrl = 'https://api.themoviedb.org/3/';

  async getDataFromServer(url, options = {}) {
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      return data;
    } catch (err) {
      return { error: err.message };
    }
  }

  async searchMovie(searchQuery = 'return', pageNumber = 1) {
    const url = `${this.baseUrl}search/movie?api_key=${this.apiKey}&include_adult=false&query=${searchQuery}&page=${pageNumber}`;
    const body = await this.getDataFromServer(url);
    return body.results;
  }

  async createGuestSession() {
    const url = `${this.baseUrl}authentication/guest_session/new?api_key=${this.apiKey}`;
    const data = await this.getDataFromServer(url);
    if (data.success) {
      console.log('Гостевая сессия успешно создана:', data.guest_session_id);
      return data.guest_session_id;
    } else {
      throw new Error('Ошибка создания гостевой сессии');
    }
  }

  async rateMovie(movieId, userRating, guestSessionId) {
    const url = `${this.baseUrl}movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        value: userRating,
      }),
    };
    const data = await this.getDataFromServer(url, options);
    if (data.success) {
      return;
    } else if (data.error) {
      throw new Error('Ошибка при оценке фильма');
    } else {
      return [];
    }
  }

  async getRatedMovies(guestSessionId) {
    const url = `${this.baseUrl}guest_session/${guestSessionId}/rated/movies?api_key=${this.apiKey}`;
    const body = await this.getDataFromServer(url);
    if (body.results && body) {
      return body.results;
    }
    return [];
  }
  async getGenersList() {
    const url = `${this.baseUrl}genre/movie/list?api_key=${this.apiKey}`;
    const body = await this.getDataFromServer(url);
    if (body.genres) {
      return body.genres;
    } else {
      throw new Error('Ошибка при получении списка жанров');
    }
  }
  async getItemPagination(searchQuery = 'return') {
    const url = `${this.baseUrl}search/movie?api_key=${this.apiKey}&include_adult=false&query=${searchQuery}&page=1`;
    const body = await this.getDataFromServer(url);
    if (body && body.total_results) {
      return body.total_results;
    } else {
      throw new Error('Ошибка при получении количества страниц');
    }
  }
}

export default MovieService;
