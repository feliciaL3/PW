import * as React from 'react';
import { useState } from 'react';
import { AppBar, Toolbar, Typography, Switch, IconButton, InputBase } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ onSubmit, handleToggleTheme, toggleTheme, setBooks }) => {
  const [term, setTerm] = useState('');
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    onSubmit(term);
  };

  const handleLogout = () => {
    logout();
    setBooks([]);
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Book Search
        </Typography>
        <Switch checked={toggleTheme} onChange={handleToggleTheme} />
        <form onSubmit={handleSearch} style={{ display: 'flex' }}>
          <InputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            sx={{ color: 'inherit', ml: 1 }}
          />
          <IconButton type="submit" aria-label="search" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </form>
        {auth.token && (
          <>
            <IconButton color="inherit" onClick={() => navigate('/liked')}>
              Liked Books
            </IconButton>
            <IconButton color="inherit" onClick={handleLogout}>
              Logout
            </IconButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
