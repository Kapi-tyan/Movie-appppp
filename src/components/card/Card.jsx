import React from 'react';
import { Flex, Alert, Spin } from 'antd';

import Context from '../ContextGenres/ContextGenres.js';
import OneMovieCard from '../oneMovieCard/oneMovieCard.jsx';
import './Card.css';

const MovieCard = ({ movies, loading, error, onRatingChange }) => {
  if (loading) {
    return (
      <div className="wrapper-loading">
        <Flex align="center" justify="center" style={{ height: '100vh' }}>
          <Spin size="large" />
        </Flex>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main">
        <div className="wrapper-loading">
          <Alert
            className="error-alert"
            message="Ошибка"
            description="Произошла ошибка при загрузке фильмов. Пожалуйста, попробуйте позже."
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="main">
        <div className="wrapper-loading">
          <Alert
            className="error-alert"
            message="Фильмы не найдены"
            description="К сожалению, не удалось найти фильмы по вашему запросу."
            type="info"
            showIcon
          />
        </div>
      </div>
    );
  }
  return (
    <Context.Consumer>
      {({ genres }) => (
        <>
          {movies.map((movie) => {
            const genreButtons = movie.genre.map((genreId) => {
              const genre = genres.find(([id]) => id === genreId);
              return genre ? (
                <button key={genreId} className="genre-button">
                  {genre[1]}
                </button>
              ) : null;
            });
            return (
              <OneMovieCard key={movie.id} movie={movie} genreButtons={genreButtons} onRatingChange={onRatingChange} />
            );
          })}
        </>
      )}
    </Context.Consumer>
  );
};

export default MovieCard;
