import React from 'react';
import { Rate } from 'antd';
import './Rate.css';

const RateStars = ({ id, value, onRatingChange }) => {
  const handleChange = (value) => {
    if (onRatingChange) {
      onRatingChange(id, value);
    }
  };
  return <Rate className="rate-stars" allowHalf count={10} value={value} onChange={handleChange} />;
};

export default RateStars;
