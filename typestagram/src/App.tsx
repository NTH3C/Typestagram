import './App.css'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

import ProfilePage from './pages/myProfilePage';
import FeedPage from './pages/feedPage';

import Register from './pages/register';
import Login from './pages/login';
import { Alert, AppBar, Box, Button as ButtonIcon, Divider, Drawer, IconButton, Stack, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Profile from './pages/Profile';
import axios from 'axios';
import Navbar from './components/Navbar';
import { ChatBubbleOutline, Favorite, FavoriteBorder, HeartBroken } from '@mui/icons-material';
import type { User } from './types/Profile';

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
          <Navbar />
          <Routes>
            <Route path="/" element={<MyApp />} />

            <Route path="/myprofile" element={<ProfilePage />}/>
            <Route path="/feed" element={<FeedPage />} />

          <Route path="/register" element={<Register />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/logout" element={<Logout />}/>
          <Route path="/profile/:id" element={<Profile />}/>
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

  const loaderRef = useRef<HTMLDivElement | null>(null);

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
      <Box sx={{display: "flex", gap: "2em", padding: "2em"}}>
        <ListCardPosts posts={posts}/>
      </Box>


    </>
  )
}

type ListCardPostsProps = {
  posts: Post[]
}

function ListCardPosts({posts}: ListCardPostsProps) {

  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const openPost = useContext(OpenPostContext);

  const storedUser = localStorage.getItem("user");
  const user: User = JSON.parse(storedUser!) as User;

  useEffect(() => {
    const fetchUserLikes = async () => {
      const res = await axios.get(
        `http://localhost:8080/likes/user/${user.email}`
      );

      // assuming backend returns array of posts liked
      setLikedPosts(res.data.map((like: any) => like.id));
    };

    fetchUserLikes();
  }, []);

  const handleLike = async (post: Post) => {
    try {
      const data = await toggleLike(post);
      const postId = Number(post.id);

      setLikedPosts(prev =>
        prev.includes(postId)
          ? prev.filter(id => id !== postId)
          : [...prev, postId]
      );
    } catch (err) {
      console.error("Erreur like:", err);
    }
  };

  

  return(
    <>
      {posts.map((post, index) => {
        return (
          <CardPost liked={likedPosts.includes(Number(post.id))}  key={index} toggleLike={() => {handleLike(post)}} openComment={(id) => {openPost!(id as number)}} post={post}/>
        )
      })}
    </>
  )
}

type CardPostProps = {
  toggleLike: () => void;
  openComment: (id: number | string) => void;
  post: Post;
  liked: boolean
};

function CardPost({ toggleLike, openComment, post, liked }: CardPostProps) {

  return(
    <Box sx={{maxWidth: "fit-content", boxShadow: "2px 3px 5px black"}}>
      <img src={ "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeJQeJyzgAzTEVqXiGe90RGBFhfp_4RcJJMQ&s" }/>
      <Box sx={{display: "flex", gap:"1em", flexDirection: "row-reverse", padding: "0 0.5em"}}>
        <ChatBubbleOutline onClick={() => openComment(post.id)} />
        {!liked ? 
          <FavoriteBorder onClick={() => {toggleLike();}} />
          :
          <Favorite onClick={() => {toggleLike();}} sx={{color: "red"}}/>
        }
      </Box>
      <Divider />
      <Box sx={{display: "flex", margin: 0, padding: 0}}>
        <p>{post.content}</p>
      </Box>
    </Box>
  )
}

export default App;
