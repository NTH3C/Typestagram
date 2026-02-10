import './App.css'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

import ProfilePage from './pages/myProfilePage';

import Register from './pages/register';
import Login from './pages/login';
import { Box, Button as ButtonIcon, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import Profile from './pages/Profile';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyApp />} />

        <Route path="/myprofile" element={<ProfilePage />}/>


        <Route path="/register" element={<Register />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/logout" element={<Logout />}/>
        <Route path="/profile/:id" element={<Profile />}/>

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

  return(
    <></>
  )
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
      </Box>
      <h1>Accueil</h1>   

    </>
  )
}

export default App
