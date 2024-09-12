import React from 'react';
import { Card, Flex, Typography, Alert, Spin } from 'antd';

import Context from '../ContextGenres/ContextGenres.js';
import RateStars from '../rate/Rate';
import './Card.css';

// Реализовать обработку отсутствия сети
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
              <Card key={movie.id} className="card-movie" hoverable>
                <Flex justify="space-between">
                  <img className="card-movie__img" alt={movie.original_title} src={movie.poster_path} />
                  <Flex vertical align="flex-start" style={{ width: 250, height: 282, padding: 10 }}>
                    <Typography.Title level={3}>
                      {movie.original_title}
                      <span
                        className={`card-rating ${movie.rating > 3 && movie.rating <= 5 ? 'orange' : ''} ${movie.rating > 5 && movie.rating <= 7 ? 'yellow' : ''} ${movie.rating > 7 ? 'green' : ''}`}
                      >
                        {movie.rating}
                      </span>
                    </Typography.Title>
                    <span>{movie.release_date}</span>
                    <div className="genre-buttons">{genreButtons}</div> {/* Отображение кнопок */}
                    <p>{movie.overview}</p>
                    <RateStars
                      id={movie.id}
                      value={movie.userRating}
                      onRatingChange={onRatingChange}
                      onChange={(newRating) => onRatingChange(movie.id, newRating)}
                    />
                  </Flex>
                </Flex>
              </Card>
            );
          })}
        </>
      )}
    </Context.Consumer>
  );
};

export default MovieCard;
