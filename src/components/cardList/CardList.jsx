import React from 'react';
import { Flex, Alert, Spin } from 'antd';

import Context from '../ContextGenres/ContextGenres.js';
import OneMovieCard from '../oneMovieCard/oneMovieCard.jsx';
import './CardList.css';

const CardList = ({ movies, loading, error, ratedOnly, onRatingChange }) => {
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
            description="Вы точно поставили какому-нибудь фильму оценку?"
            type="info"
            showIcon
          />
        </div>
      </div>
    );
  }

  const filteredMovies = ratedOnly ? movies.filter((movie) => movie.userRating) : movies;
  if (filteredMovies.length === 0) {
    return (
      <div className="main">
        <div className="wrapper-loading">
          <Alert
            className="error-alert"
            message="Нет оцененных фильмов"
            description="Пожалуйста, оцените хотя бы один фильм!"
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
          {filteredMovies.map((movie) => {
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

export default CardList;
