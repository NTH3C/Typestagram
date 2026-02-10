import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type Post = {
  id: number;
  content: string;
  authorEmail: string;
  createdAt: string;
};

const API_URL = "http://localhost:8080";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  async function loadFeed() {
    try {
      setError(null);
      const res = await fetch(`${API_URL}/posts`);
      if (!res.ok) throw new Error("Erreur lors du chargement du feed");
      const data = (await res.json()) as Post[];
      setPosts(data);
    } catch (e: any) {
      setError(e?.message ?? "Erreur API");
    }
  }

  useEffect(() => {
    loadFeed();
  }, []);

  async function createPost() {
    const trimmed = content.trim();
    setError(null);

    if (!trimmed) {
      setError("Le contenu ne peut pas être vide.");
      return;
    }

    if (!token) {
      setError("Tu dois être connecté pour publier.");
      return;
    }

    setLoading(true);

    try {
      const optimistic: Post = {
        id: Date.now(),
        content: trimmed,
        authorEmail: "me",
        createdAt: new Date().toISOString(),
      };
      setPosts((prev) => [optimistic, ...prev]);
      setContent("");

      const res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: trimmed }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message =
          body?.message ??
          (res.status === 401 ? "Token invalide / non connecté" : "Erreur API");
        throw new Error(message);
      }

      const created = (await res.json()) as Post;

      await loadFeed();
    } catch (e: any) {
      setError(e?.message ?? "Erreur API");
      await loadFeed();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Feed
      </Typography>

      <Stack spacing={2} mb={3}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Nouveau post"
          multiline
          minRows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <Button
          variant="contained"
          onClick={createPost}
          disabled={loading || content.trim().length === 0}
        >
          {loading ? "Publication..." : "Publier"}
        </Button>
      </Stack>

      <Stack spacing={2}>
        {posts.map((p) => (
          <Box
            key={p.id}
            sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2 }}
          >
            <Typography variant="caption" color="text.secondary">
              {p.authorEmail} · {new Date(p.createdAt).toLocaleString()}
            </Typography>
            <Typography sx={{ whiteSpace: "pre-wrap", mt: 1 }}>
              {p.content}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}
