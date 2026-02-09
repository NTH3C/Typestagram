import { useForm } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:8080/auth/login", data);
      if (!res.data.access_token) {
        setError("Email ou mot de passe incorrect");
        return;
      }
      localStorage.setItem("token", res.data.access_token);
      console.log("Connecté :", res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      setError("Erreur connexion");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 400, mx: "auto" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register("email", {
          required: "Email requis",
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message: "Email invalide" }
        })}
      />

      <TextField
        label="Mot de passe"
        type="password"
        fullWidth
        margin="normal"
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register("password", { required: "Mot de passe requis" })}
      />

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Se connecter</Button>
    </Box>
  );
}