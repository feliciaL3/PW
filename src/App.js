import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import MainPage from './components/mainPage';
import LikedPage from './components/likedPage';
import UserData from './components/UserData';
import Login from './components/Login';
import { searchBooks } from './api';
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [books, setBooks] = useState([]);
  const [likedBooks, setLikedBooks] = useState([]);
  const [toggleDarkMode, setToggleDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedLikedBooks = JSON.parse(localStorage.getItem('likedBooks')) || [];
    setLikedBooks(storedLikedBooks);
  }, []);

  const handleSubmit = async (term, page = 1) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setBooks([]);
    } else {
      const result = await searchBooks(term, page);
      setBooks(result);
    }
  };

  const handleDelete = (bookId) => {
    const updatedBooks = books.filter(book => book.id !== bookId);
    setBooks(updatedBooks);
  };

  const handleLike = (book) => {
    const updatedLikedBooks = [...likedBooks, book];
    setLikedBooks(updatedLikedBooks);
    localStorage.setItem('likedBooks', JSON.stringify(updatedLikedBooks));
  };

  const handleUnlike = (bookId) => {
    const updatedLikedBooks = likedBooks.filter(book => book.id !== bookId);
    setLikedBooks(updatedLikedBooks);
    localStorage.setItem('likedBooks', JSON.stringify(updatedLikedBooks));
  };

  const toggleDarkTheme = () => {
    setToggleDarkMode(!toggleDarkMode);
  };

  function RequireAuth({ children }) {
    const { auth } = useAuth();
    return auth.token ? children : <Navigate to="/login" replace />;
  }

  const theme = createTheme({
    palette: {
      mode: toggleDarkMode ? 'dark' : 'light',
      primary: { main: '#90caf9' },
      secondary: { main: '#f48fb1' },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Header
            onSubmit={handleSubmit}
            handleToggleTheme={toggleDarkTheme}
            toggleTheme={toggleDarkMode}
            setBooks={setBooks} // Ensures Header can clear books
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RequireAuth><MainPage books={books} searchTerm={searchTerm} onSearch={handleSubmit} onDelete={handleDelete} onFavorite={handleLike} likedBooks={likedBooks} /></RequireAuth>} />
            <Route path="/liked" element={<RequireAuth><LikedPage likedBooks={likedBooks} onUnlike={handleUnlike} /></RequireAuth>} />
            <Route path="/user-data" element={<RequireAuth><UserData /></RequireAuth>} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
