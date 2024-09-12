import React from 'react';
import { Pagination } from 'antd';
import './Pagination.css';

const PaginationItem = ({ onPageChange }) => {
  const handlePageChange = (page) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  return <Pagination className="pagination" defaultCurrent={1} total={50} pageSize={6} onChange={handlePageChange} />;
};

export default PaginationItem;
