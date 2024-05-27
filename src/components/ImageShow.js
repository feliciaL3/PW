import React, { useEffect, useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import DeleteIcon from '@mui/icons-material/Delete';

function ImageShow({ image, onDelete, onFavorite }) {
  const [liked, setLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const likedBooks = JSON.parse(localStorage.getItem('likedBooks')) || [];
    const isLiked = likedBooks.some(book => book.id === image.id);
    setLiked(isLiked);
  }, [image.id]);

  const handleLike = () => {
    const likedBooks = JSON.parse(localStorage.getItem('likedBooks')) || [];

    if (!liked) {
      likedBooks.push(image);
    } else {
      const index = likedBooks.findIndex(book => book.id === image.id);
      likedBooks.splice(index, 1);
    }

    localStorage.setItem('likedBooks', JSON.stringify(likedBooks));
    setLiked(!liked);
    onFavorite(image, !liked);
  };

  return (
    <Box sx={{ width: "auto" }}>
      <Box height={200} display="flex" justifyContent="center" alignItems="center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box component="img" src={image.urls.regular} alt={image.alt_description}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {isHovered && 
          <Box sx={{ position: 'absolute', bottom: '0', left: '0', display: "flex", justifyContent: "center", width: "100%" }}>
            <Grid container>
              <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Button variant="contained" color="primary" href={image.links.download} target="_blank"><DownloadForOfflineIcon /></Button>
              </Grid>
              <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Button variant="contained" color="primary" onClick={handleLike}>
                  {liked ? <FavoriteIcon color="secondary" /> : <FavoriteIcon />}
                </Button>
              </Grid>
              <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Button variant="contained" color="error" onClick={() => onDelete(image.id)}><DeleteIcon /></Button>
              </Grid>
            </Grid>
          </Box>
        }
      </Box>
    </Box>
  );
}

export default ImageShow;
