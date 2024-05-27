import React from 'react';
import ImageList from './ImageList';
import Box from '@mui/material/Box';
import { Grid, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; 
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';

function LikedPage({ likedBooks, onUnlike }) {
  return (
    <Box sx={{ mt: 8, p: 2 }}>
      <h1>Liked Books</h1>
      {likedBooks.length === 0 ? (
        <p>You have no liked books.</p>
      ) : (
        <Grid container spacing={2} sx={{ width: '100%' }}>
          {likedBooks.map((book) => (
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
                  <Button variant="contained" color="secondary" onClick={() => onUnlike(book.id)} sx={{ m: 1 }}>
                    <DeleteIcon />
                  </Button>
                </div>
                <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '8px' }}>
                  <h3>{book.title}</h3>
                  <p>{book.author ? book.author.join(', ') : 'Unknown Author'}</p>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => onUnlike(book.id)}
                    sx={{ m: 1 }}
                  >
                    <DeleteIcon /> Unlike
                  </Button>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default LikedPage;
