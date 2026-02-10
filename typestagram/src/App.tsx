import './App.css'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

import ProfilePage from './pages/myProfilePage';
import FeedPage from './pages/feedPage';

import Register from './pages/register';
import Login from './pages/login';
import { Box, Button as ButtonIcon, IconButton, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect, useRef, useState } from 'react';
import Profile from './pages/Profile';
import axios from 'axios';


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
  }, [storedUser, navigate])

  return(
    <></>
  )
}


async function toggleLike(post: Post) {
  const res = await fetch("http://localhost:8080/likes/toggle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  const data = await res.json();
  return data;
}


type Post = {
  image: string;
  content: string;
  authorEmail: string;
  user_id: string;
  uid: string;
};


function MyApp() {
  const [visibleCount, setVisibleCount] = useState(2);
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/posts`);
            console.log(res.data);
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    fetchPost();

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + 1);
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, []);

  
  const storedUser = localStorage.getItem("user");

  const handleLike = async (post: Post) => {
    try {
      const data = await toggleLike(post);
      setLikedPosts((prev) => ({
        ...prev,
        [post.uid]: data.liked,
      }));
    } catch (err) {
      console.error("Erreur like:", err);
    }
  };

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
                      {/* <img src={post.image} alt="" /> */}
                      <a href={`/profile/${post.uid}`} >{post.authorEmail}</a>
                      <p>{post.content}</p>
                      <Button
                        onClick={() => handleLike(post)}
                        sx={{
                          color: likedPosts[post.uid] ? "red" : "black",
                          textTransform: "none",
                        }}
                      >
                        {likedPosts[post.uid] ? "Liked" : "Like"}
                      </Button>
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

export default App;
