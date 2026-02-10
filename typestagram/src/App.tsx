import './App.css'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

import ProfilePage from './pages/myProfilePage';
import FeedPage from './pages/feedPage';

import Register from './pages/register';
import Login from './pages/login';
import { Box, Button as ButtonIcon, IconButton, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Profile from './pages/Profile';
import axios from 'axios';

type Comment = {
  id: number;
  text: string;
  authorEmail: string;
  createdAt: string;
};

type Post = {
  id: number | string;
  content: string;
  authorEmail: string;
  createdAt: string;
  uid: string;
  comments?: Comment[];
};

const API_URL = "http://localhost:8080";

export const OpenPostContext = createContext<((id: number) => void) | null>(null);

function App() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPost = async (postId: number) => {
    setError(null);
    try {
      const res = await axios.get<Post>(`${API_URL}/posts/${postId}`);
      setSelectedPost(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Erreur API");
    }
  };

  const submitComment = async () => {
    if (!selectedPost) return;
    const text = commentText.trim();
    if (!text) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Tu dois être connecté pour commenter.");
      return;
    }
    setCommentLoading(true);
    setError(null);
    try {
      const optimistic: Comment = {
        id: Date.now(),
        text,
        authorEmail: "me",
        createdAt: new Date().toISOString(),
      };
      setSelectedPost((p) => (p ? { ...p, comments: [...(p.comments ?? []), optimistic] } : p));
      setCommentText("");

      const res = await axios.post(
        `${API_URL}/posts/${selectedPost.id}/comments`,
        { text }, // corps JSON
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.data) {
        const body = await res.data;
        const message = body?.message ?? "Erreur API";
        throw new Error(message);
      }

      await openPost(Number(selectedPost.id));
    } catch (e: any) {
      setError(e?.message ?? "Erreur API");
      await openPost(Number(selectedPost.id));
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <OpenPostContext.Provider value={openPost}>
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
    </OpenPostContext.Provider>
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

  return(<></>)
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

function MyApp() {
  const [visibleCount, setVisibleCount] = useState(2);
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const openPost = useContext(OpenPostContext);

  const deletePost = async (id: string) => {
  try {
    const res = await axios.delete(`http://localhost:8080/posts/${id}`);
    setPosts(post => post.filter(curpost => String(curpost.id) !== id));
  } catch (err) {
    console.error(err);
  }
  
}

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
                  <div key={index} style={{ cursor: 'pointer', border: '1px solid #ddd', padding: 8, marginBottom: 8 }} onClick={() => openPost?.(Number(post.id))}>
                    <a href={`/profile/${post.uid}`} onClick={(e) => e.stopPropagation()}>{post.authorEmail}</a>
                    <p>{post.content}</p>
                    <Button variant="outlined" onClick={(e) => { e.stopPropagation(); deletePost(String(post.id)); }}>supprimer</Button>
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
