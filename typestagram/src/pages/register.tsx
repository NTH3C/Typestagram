import { useForm } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import { useState } from "react";

function Register() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [ error, setError ] = useState("");

    const watch_password = watch("password");

    const onSubmit = (data) => {
        //faire un call API
        console.log(data);
    };

    return (
        <Box component="form"       sx={{ maxWidth: 400, mx: "auto", mt: 4 }} onSubmit={handleSubmit(onSubmit)}>

        <p>{error}</p>

        <TextField
            label="Username"
            fullWidth
            margin="normal"
            error={!!errors.username}
            helperText={errors.username?.message}
            {...register("username", { 
                required: true,
                validate: (value) =>
                        value === "" || "Vous devez reseigner un utilisateur",
                }
            )}
        />    
            
        <TextField
            label="Email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"
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
        fullWidth
        type="password"
        margin="normal"
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register("password", {
            required: "Mot de passe requis",
            pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
            message:
                "8 caractères min, 1 majuscule, 1 minuscule, 1 chiffre, 1 spécial",
            },
        })}
        />

        <TextField
            label="Confirmer Mot de passe"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.vpassword}
            helperText={errors.vpassword?.message}
            {...register("vpassword",
                 { required: true, 
                    validate: (value) =>
                        value === watch_password || "Les mots de passe ne correspondent pas",
                }
                )}
        />

        <Button type="submit" variant="contained" fullWidth>
            Envoyer
        </Button>
        </Box>
    );
}

export default Register