import React, { Component } from 'react';
import { parseISO, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Alert } from 'antd';

import MovieCard from './components/card/Card';
import PaginationItem from './components/pagination/Pagination';
import SearchInput from './components/search/Search';
import HeaderTabs from './components/header/Header';
import noImage from './img/no-image-svgrepo-com.svg';
import CardList from './components/cardList/CardList';
import MovieService from './movieService/MovieService';
import { GenreProvider } from './components/ContextGenres/ContextGenres';

class App extends Component {
  constructor(props) {
    super(props);
    this.movieService = new MovieService();
  }

  state = {
    currentPage: 1,
    movies: [],
    ratedMovies: [],
    error: false,
    loading: true,
    searchQuery: 'return',
    guestSessionId: null,
    ratedOnly: false,
    genre: 0,
    totalResults: 0,
    hasRated: false,
  };

  onError = () => {
    this.setState({ error: true });
  };

  componentDidMount() {
    this.itemPagination();
    this.movieService.getGenersList().then((genres) => {
      const formattedGenres = genres.map((genre) => [genre.id, genre.name]);
      this.setState({ genres: formattedGenres });
    });
    const savedSessionId = localStorage.getItem('guestSessionId');
    if (savedSessionId) {
      this.setState({ guestSessionId: savedSessionId }, this.getRatedMovies);
    } else {
      this.movieService.createGuestSession().then((sessionId) => {
        if (sessionId) {
          this.setState({ guestSessionId: sessionId });
          localStorage.setItem('guestSessionId', sessionId);
        }
      });
    }
    const hasRated = localStorage.getItem('hasRated') === 'true';
    this.setState({ hasRated });
    this.updateMovies(this.state.searchQuery, this.state.currentPage);
  }

  truncateAtWord(str, max = 100, ellipsis = '…') {
    if (str.length <= max) return str;
    let trimmed = str.substr(0, max);
    if (str[max] !== ' ') {
      trimmed = trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')));
    }
    return trimmed + ellipsis;
  }
  itemPagination = (searchQuery) => {
    this.movieService
      .getItemPagination(searchQuery)
      .then((totalResults) => {
        this.setState({ totalResults });
      })
      .catch((error) => {
        console.error('Ошибка при получении количества страниц:', error);
      });
  };
  createMovieCard = (movies) => {
    if (Array.isArray(movies)) {
      return movies.map((movie) => this.createMovieCard(movie));
    }
    const movie = movies;
    return {
      original_title: movie.original_title,
      release_date: movie.release_date
        ? format(parseISO(movie.release_date), 'LLLL d, yyyy', { locale: ru })
        : 'unknown',
      poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : noImage,
      overview: this.truncateAtWord(movie.overview),
      id: movie.id,
      rating: movie.vote_average.toFixed(1),
      userRating: movie.userRating || 0,
      genre: movie.genre_ids,
    };
  };
  updateMovies(searchQuery = 'return', pageNumber = 1) {
    this.setState({ loading: true });
    this.movieService
      .searchMovie(searchQuery, pageNumber)
      .then((movies) => {
        const movieData = this.createMovieCard(movies);
        this.setState({ movies: movieData }, () => {
          if (this.state.hasRated) {
            this.movieService
              .getRatedMovies(this.state.guestSessionId)
              .then((ratedMoviesFromServer) => {
                const ratedMoviesMap = new Map(ratedMoviesFromServer.map((movie) => [movie.id, movie]));
                const updatedMovies = this.state.movies.map((movie) => {
                  const ratedMovie = ratedMoviesMap.get(movie.id);
                  return {
                    ...movie,
                    userRating: ratedMovie ? ratedMovie.rating : movie.userRating,
                  };
                });
                this.setState({ movies: updatedMovies, loading: false, error: false });
              })
              .catch((error) => {
                this.onError(error);
              });
          }
        });
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.onError(error);
        this.setState({ loading: false, error: true });
      });
  }

  getRatedMovies() {
    const { guestSessionId, ratedMovies } = this.state;
    if (!guestSessionId) return;
    this.setState({ loading: false });
    if (this.state.hasRated) {
      this.movieService
        .getRatedMovies(guestSessionId)
        .then((ratedMoviesFromServer) => {
          const ratedMoviesMap = new Map(ratedMovies.map((movie) => [movie.id, movie]));
          const updatedRatedMovies = ratedMoviesFromServer.map((movie) => {
            const existingMovie = ratedMoviesMap.get(movie.id);
            const movieCard = this.createMovieCard({
              ...movie,
              userRating: existingMovie ? existingMovie.userRating : movie.rating || 0,
            });
            return movieCard;
          });
          this.setState({ ratedMovies: updatedRatedMovies, loading: false, error: false });
        })
        .catch((error) => {
          this.onError(error);
        });
    }
  }

  handlePageChange = (currentPage) => {
    this.setState({ currentPage }, () => {
      this.updateMovies(this.state.searchQuery, currentPage);
    });
  };

  handleSearch = (searchQuery) => {
    this.setState({ searchQuery, currentPage: 1 }, () => {
      this.itemPagination(searchQuery);
      this.updateMovies(searchQuery, this.state.currentPage);
    });
  };

  handleRatingChange = (id, value) => {
    const { guestSessionId } = this.state;
    this.setState({ hasRated: true }, () => {
      localStorage.setItem('hasRated', true);
    });
    if (!guestSessionId) {
      console.error('Гостевая сессия не создана!');
      return;
    }
    this.movieService
      .rateMovie(id, value, guestSessionId)
      .then(() => {
        this.setState(
          (prevState) => {
            const updatedMovies = prevState.movies.map((movie) =>
              movie.id === id ? { ...movie, userRating: value } : movie
            );
            return { movies: updatedMovies };
          },
          () => {
            this.getRatedMovies();
          }
        );
      })
      .catch((error) => {
        console.error('Ошибка при оценке фильма:', error);
      });
  };

  render() {
    const { movies, ratedMovies, loading, error, currentPage, userRating, genres, totalResults } = this.state;
    if (!navigator.onLine) {
      return (
        <div className="main">
          <div className="wrapper-loading">
            <Alert className="error-alert" message="Ошибка" description="Нет интернета" type="error" showIcon />
          </div>
        </div>
      );
    }
    const searchContent = (
      <div>
        <SearchInput updateMovies={this.handleSearch} pageNumber={currentPage} />
        <div className="wrapper-card">
          <MovieCard
            movies={movies}
            value={userRating}
            loading={loading}
            error={error}
            onRatingChange={this.handleRatingChange}
          />
          <PaginationItem onPageChange={this.handlePageChange} totalResults={totalResults} />
        </div>
      </div>
    );
    const ratedContent = (
      <div>
        <div className="wrapper-card">
          <CardList
            movies={ratedMovies}
            loading={loading}
            error={error}
            ratedOnly={this.state.ratedOnly}
            onRatingChange={this.handleRatingChange}
          />
        </div>
      </div>
    );
    return (
      <div className="main">
        <div className="wrapper">
          <div className="wrapper-header">
            <GenreProvider genres={genres}>
              <HeaderTabs searchContent={searchContent} ratedContent={ratedContent} />
            </GenreProvider>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
