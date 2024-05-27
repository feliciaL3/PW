import React, { useState } from 'react';
import { Grid, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const ImageList = ({ books, onDelete, onFavorite, likedBooks }) => {
  const isBookLiked = (bookId) => {
    return likedBooks.some((book) => book.id === bookId);
  };

  return (
    <Grid container spacing={2} sx={{ width: '100%' }}>
      {books.map((book) => (
        <Grid item xs={12} sm={6} md={3} lg={3} key={book.id}> 
          <div style={{ position: 'relative', paddingBottom: '100%', overflow: 'hidden' }}>
            <img
              src={`http://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`}
              alt={book.title}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', flexDirection: 'column' }}>
              <Button variant="contained" color="primary" href={`http://openlibrary.org${book.id}`} target="_blank" sx={{ m: 1 }}>
                <DownloadForOfflineIcon />
              </Button>
              <Button variant="contained" color="secondary" onClick={() => onDelete(book.id)} sx={{ m: 1 }}>
                <DeleteIcon />
              </Button>
            </div>
            <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '8px' }}>
              <h3>{book.title}</h3>
              <p>{book.author ? book.author.join(', ') : 'Unknown Author'}</p>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => onFavorite(book)}
                sx={{ m: 1 }}
              >
                {isBookLiked(book.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                {isBookLiked(book.id) ? 'Liked' : 'Like'}
              </Button>
            </div>
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

export default ImageList;
