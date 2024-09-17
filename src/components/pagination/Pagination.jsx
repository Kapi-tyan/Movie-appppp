import React from 'react';
import { Pagination } from 'antd';
import './Pagination.css';

const PaginationItem = ({ onPageChange, totalResults }) => {
  const handlePageChange = (page) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <Pagination
      className="pagination"
      defaultCurrent={1}
      total={totalResults}
      pageSize={20}
      onChange={handlePageChange}
    />
  );
};

export default PaginationItem;
