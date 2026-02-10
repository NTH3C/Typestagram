import './App.css'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

import ProfilePage from './pages/myProfilePage';
import FeedPage from './pages/feedPage';

import Register from './pages/register';
import Login from './pages/login';
import { Box, Button as ButtonIcon, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect, useRef, useState } from 'react';
import Profile from './pages/Profile';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyApp />} />

        <Route path="/myprofile" element={<ProfilePage />}/>
        <Route path="/feed" element={<FeedPage />} />


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

type Post = {
  image: string;
  description: string;
  username: string;
};

const posts: Post[] = [
  {
    image: "https://picsum.photos/500/300?random=11",
    description: "Morning coffee hits different today ☕",
    username: "lucas",
  },
  {
    image: "https://picsum.photos/500/300?random=12",
    description: "Finally finished my setup ✨",
    username: "emma_dev",
  },
  {
    image: "https://picsum.photos/500/300?random=13",
    description: "Sunday walk in the forest 🌲",
    username: "noah",
  },
  {
    image: "https://picsum.photos/500/300?random=14",
    description: "New haircut, what do you think?",
    username: "chloe",
  },
  {
    image: "https://picsum.photos/500/300?random=15",
    description: "Late night coding session 💻",
    username: "maxime",
  },
  {
    image: "https://picsum.photos/500/300?random=16",
    description: "Homemade burger tonight 🍔",
    username: "lea",
  },
  {
    image: "https://picsum.photos/500/300?random=17",
    description: "Sun was crazy beautiful 🌞",
    username: "tom",
  },
  {
    image: "https://picsum.photos/500/300?random=18",
    description: "Gym progress slowly but surely 💪",
    username: "sarah_fit",
  },
  {
    image: "https://picsum.photos/500/300?random=19",
    description: "Movie night with friends 🎬",
    username: "enzo",
  },
  {
    image: "https://picsum.photos/500/300?random=20",
    description: "Trying photography 📷",
    username: "lina",
  },
  {
    image: "https://picsum.photos/500/300?random=21",
    description: "Rainy days mood 🌧️",
    username: "alex",
  },
  {
    image: "https://picsum.photos/500/300?random=22",
    description: "Clean desk, clear mind.",
    username: "marie",
  },
  {
    image: "https://picsum.photos/500/300?random=23",
    description: "Weekend getaway 🚗",
    username: "hugo",
  },
  {
    image: "https://picsum.photos/500/300?random=24",
    description: "Testing new recipes tonight 🍜",
    username: "ines",
  },
  {
    image: "https://picsum.photos/500/300?random=25",
    description: "Beach vibes 🌊",
    username: "nathaniel",
  },
  {
    image: "https://picsum.photos/500/300?random=26",
    description: "Reading a great book 📖",
    username: "camille",
  },
  {
    image: "https://picsum.photos/500/300?random=27",
    description: "Work hard, dream big.",
    username: "julien",
  },
  {
    image: "https://picsum.photos/500/300?random=28",
    description: "City lights at night 🌃",
    username: "zoe",
  },
  {
    image: "https://picsum.photos/500/300?random=29",
    description: "New plants in the apartment 🌿",
    username: "matteo",
  },
  {
    image: "https://picsum.photos/500/300?random=30",
    description: "Small progress is still progress.",
    username: "eva",
  },
];



function MyApp() {
  const [visibleCount, setVisibleCount] = useState(2);

  const loaderRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + 1);
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, []);

  
  const storedUser = localStorage.getItem("user");

  return (
    <>
      <Box>
      <h1>Accueil</h1> 
      {
        
        storedUser ? (
          <div>
            <Button variant="contained" sx={{background: "red"}} href="/logout">
              se déconnecter
            </Button>
            <ul>
              <li>
                {posts.slice(0,visibleCount).map((post, index) => (
                  <div key={index}>
                    <img src={post.image} alt="" />
                    <p>{post.username}</p>
                    <p>{post.description}</p>
                  </div>
                ))}
              </li>
            </ul>
          <div ref={loaderRef} style={{ height: 20 }} />
          </div>
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
        

    </>
  )
}

export default App
