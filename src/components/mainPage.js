import React, { useState } from 'react';
import ImageList from './ImageList';
import Box from '@mui/material/Box';
import { InputBase, IconButton, Grid } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

function MainPage({ books, searchTerm, onSearch, onDelete, onFavorite, likedBooks }) {
  const [term, setTerm] = useState(searchTerm);

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(term);
  };

  return (
    <Box sx={{ mt: 8, p: 2 }}>
      <Grid container justifyContent="center" sx={{ mb: 4 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '600px' }}>
          <InputBase
            placeholder="Search books..."
            inputProps={{ 'aria-label': 'search books' }}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            sx={{
              color: 'inherit',
              ml: 1,
              flex: 1,
              border: '1px solid #ccc', // Add border
              borderRadius: '4px', // Optional: Add border radius
              padding: '4px 8px' // Optional: Add padding for better appearance
            }}
          />
          <IconButton type="submit" aria-label="search" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </form>
      </Grid>
      <h1>Results for "{searchTerm}"</h1>
      <ImageList books={books} onDelete={onDelete} onFavorite={onFavorite} likedBooks={likedBooks} />
    </Box>
  );
}

export default MainPage;