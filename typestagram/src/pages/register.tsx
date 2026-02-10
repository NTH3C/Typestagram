import { useForm } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import { useState } from "react";
import axios from "axios";

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [error, setError] = useState("");

  const watchPassword = watch("password");

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:8080/auth/register", data);
      console.log(res.data);
    } catch {
      setError("Erreur lors de l'inscription");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 400, mx: "auto" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <TextField label="Username" fullWidth margin="normal"
        {...register("username", { required: "username"})} />

      <TextField label="Email" fullWidth margin="normal" error={!!errors.email} helperText={errors.email?.message}
        {...register("email", { required: "Email requis", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message: "Email invalide" }})} />

      <TextField label="Mot de passe" type="password" fullWidth margin="normal" error={!!errors.password} helperText={errors.password?.message}
        {...register("password", { required: "Mot de passe requis", pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, message: "Mot de passe trop faible" } })} />

      <TextField label="Confirmer mot de passe" type="password" fullWidth margin="normal" error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message}
        {...register("confirmPassword", { required: "Confirmation requise", validate: v => v === watchPassword || "Les mots de passe ne correspondent pas" })} />

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>S'inscrire</Button>

      <span>Vous avez déjà un compte ? <a href="/login">Connectez vous</a></span>

    </Box>
  );
}