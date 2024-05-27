import React, { useState } from 'react';
import { InputBase, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');

  const handleChange = (event) => {
    setTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(term);
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center', width: 400 }}>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Books"
        inputProps={{ 'aria-label': 'search books' }}
        value={term}
        onChange={handleChange}
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

export default SearchBar;
