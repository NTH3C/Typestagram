import './App.css'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

import ProfilePage from './pages/myProfilePage';
import FeedPage from './pages/feedPage';

import Register from './pages/register';
import Login from './pages/login';
import { Box, Button as ButtonIcon, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import type { User } from './types/Profile';
import { useEffect } from 'react';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyApp />} />

        <Route path="/myprofile" element={<ProfilePage 
          name="ahhhh"
          bio="rabeee"
          avatarUrl="https://i.pravatar.cc/150?img=3"
          />}/>
        <Route path="/profile/Momo" element={<ProfilePage 
          name="Momo"
          bio="Arabe"
          avatarUrl="https://i.pravatar.cc/150?img=3"
          />}/>
        <Route path="/feed" element={<FeedPage />} />


        <Route path="/register" element={<Register />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/logout" element={<Logout />}/>

          
        {/* <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

function Logout() {
  const storedUser = localStorage.getItem("user");
  const navigate = useNavigate();

  useEffect(() => {
    if (storedUser) {
      localStorage.clear()
    }
  
    navigate("/")    
  })
}

function MyApp() {
  
  const storedUser = localStorage.getItem("user");

  return (
    <>
      <Box>
      {
        storedUser ? (
          <Button variant="contained" sx={{background: "red"}} href="/logout">
            se déconnecter
          </Button>// ou ce que tu veux afficher quand l'utilisateur est connecté
        ) : (
          <Button variant="contained" href="/login">
            Login
          </Button>
        )
        
      }
      <Button variant="outlined" href="/feed">
        Feed
      </Button>

      </Box>
      <h1>Accueil</h1>   

    </>
  )
}

export default App
