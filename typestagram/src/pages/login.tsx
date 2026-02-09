import { useForm } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import { useState } from "react";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      setError("");
      // 🔗 call API login ici
      console.log(data);
    } catch (err) {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 400, mx: "auto", mt: 4 }}
    >
      {error && <p style={{ color: "red" }}>{error}</p>}

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register("email", {
          required: "Email requis",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
            message: "Email invalide",
          },
        })}
      />

      <TextField
        label="Mot de passe"
        type="password"
        fullWidth
        margin="normal"
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register("password", {
          required: "Mot de passe requis",
        })}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
      >
        Se connecter
      </Button>
    </Box>
  );
}

export default Login;