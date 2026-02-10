import './App.css'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

import ProfilePage from './pages/myProfilePage';
import FeedPage from './pages/feedPage';

import Register from './pages/register';
import Login from './pages/login';
import { Box, Typography, Drawer, Stack, TextField, Alert } from '@mui/material';
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
  uid?: string;
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

          {/* <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} /> */}
        </Routes>

        <Drawer
          anchor="right"
          open={Boolean(selectedPost)}
          onClose={() => setSelectedPost(null)}
          PaperProps={{ sx: { width: { xs: '100%', sm: 420 }, p: 2 } }}
        >
          {selectedPost && (
            <Box>
              {error && <Alert severity="error">{error}</Alert>}
              <Typography variant="h6">{selectedPost.authorEmail}</Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(selectedPost.createdAt).toLocaleString()}
              </Typography>
              <Typography sx={{ mt: 2, whiteSpace: "pre-wrap" }}>
                {selectedPost.content}
              </Typography>

              <Box mt={3}>
                <Typography variant="subtitle1">Commentaires</Typography>
                <Stack spacing={1} mt={1}>
                  {(selectedPost.comments ?? []).map((c) => (
                    <Box key={c.id} sx={{ borderTop: '1px solid #eee', pt:1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {c.authorEmail} · {new Date(c.createdAt).toLocaleString()}
                      </Typography>
                      <Typography>{c.text}</Typography>
                    </Box>
                  ))}
                </Stack>

                <Box mt={2}>
                  <TextField
                    label="Ajouter un commentaire"
                    multiline
                    minRows={2}
                    fullWidth
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    sx={{ mt: 1 }}
                    onClick={submitComment}
                    disabled={commentLoading || commentText.trim().length === 0}
                  >
                    {commentLoading ? "Envoi..." : "Commenter"}
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Drawer>
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
  })

  return(<></>)
}

function MyApp() {
  const [visibleCount, setVisibleCount] = useState(2);
  const [posts, setPosts] = useState<Post[]>([]);

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

export default App
