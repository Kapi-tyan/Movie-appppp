import React from 'react';
import { Card, Typography, Flex } from 'antd';

import RateStars from '../rate/Rate';
import '../card/Card.css';

const OneMovieCard = ({ movie, genreButtons, onRatingChange }) => {
  return (
    <Card key={movie.id} className="card-movie" hoverable>
      <Flex justify="space-between">
        <img className="card-movie__img" alt={movie.original_title} src={movie.poster_path} />
        <Flex vertical align="flex-start" style={{ width: 250, height: 282, padding: 10 }}>
          <Typography.Title level={3}>
            {movie.original_title}
            <span
              className={`card-rating ${movie.rating > 3 && movie.rating <= 5 ? 'orange' : ''} 
              ${movie.rating > 5 && movie.rating <= 7 ? 'yellow' : ''} 
              ${movie.rating > 7 ? 'green' : ''}`}
            >
              {movie.rating}
            </span>
          </Typography.Title>
          <span>{movie.release_date}</span>
          <div className="genre-buttons">{genreButtons}</div>
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
};

export default OneMovieCard;
