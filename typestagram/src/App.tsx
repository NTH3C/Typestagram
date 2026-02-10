import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProfilePage from './pages/myProfilePage';

import Register from './pages/register';
import Login from './pages/login';
import { Box, Button as ButtonIcon } from '@mui/material';
import Button from '@mui/material/Button';


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



        <Route path="/register" element={<Register />}/>
        <Route path="/login" element={<Login />}/>

        {/* <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

function MyApp() {

  return (
    <>
      <Box>
        <Button variant="contained" href="/login">Login</Button>
      </Box>
      <h1>Accueil</h1>   

    </>
  )
}

export default App
