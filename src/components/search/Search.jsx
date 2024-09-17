import React, { Component } from 'react';
import { Input } from 'antd';
import debounce from 'lodash/debounce';

import './Search.css';

class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueForm: '',
    };
    this.debouncedSearch = debounce(this.handleSearch, 400);
  }

  handleChange = (evt) => {
    const { value } = evt.target;
    this.setState({ valueForm: value });
    this.debouncedSearch(value);
  };

  handleSearch = (searchQuery) => {
    const { updateMovies, pageNumber } = this.props;
    if (searchQuery.trim() !== '') {
      updateMovies(searchQuery, pageNumber);
    } else {
      this.props.updateMovies('return', this.props.pageNumber);
    }
  };

  render() {
    return (
      <Input
        className="input-search"
        placeholder="Type to search..."
        value={this.state.valueForm}
        onChange={this.handleChange}
        autoFocus
        required
      />
    );
  }
}

export default SearchInput;
