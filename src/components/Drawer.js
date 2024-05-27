import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { createSvgIcon } from '@mui/material/utils';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';


const HomeIcon = createSvgIcon(
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />,
    'Home',
  );

export default function TemporaryDrawer() {

  const [open, setOpen] = React.useState(false);
  const history = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const { auth, logout } = useAuth();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUsername = localStorage.getItem('username');
      setUsername(updatedUsername);
    };
  
    window.addEventListener('storage', handleStorageChange);
  
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleListItemClick = (text) => {
    if (!auth.token) {
        history('/login');
    } else {
        history(text === 'Liked' ? '/liked' : '/');
    }
};

const handleLogout = () => {
  logout();
  history('/login');
};

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
      <ListItem>
        <ListItemText primary={`Logged in as: ${auth.username || 'Not logged in'}`} />
        </ListItem>
        {['Main', 'Liked'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handleListItemClick(text)}>
              <ListItemIcon>
                {index % 2 === 0 ? <HomeIcon /> : <InboxIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
         <ListItem>
          <Button
            startIcon={<ExitToAppIcon />}
            onClick={handleLogout}
            fullWidth
            variant="outlined"
            color="secondary"
          >
            Logout
          </Button>
        </ListItem>
      </List>
      
    </Box>
  );

  return (
    <div>
        <IconButton
           onClick={toggleDrawer(true)}
           size="large"
           edge="start"
           color="inherit"
           aria-label="open drawer"
           sx={{ mr: 2 }}
         >
           <MenuIcon />
         </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}