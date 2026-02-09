import React from "react";
import { Avatar, Typography, Stack, Container } from "@mui/material";
import type { User } from "../types/Profile";

const MyProfilePage = () => {
  const storedUser = localStorage.getItem("user");


  if (!storedUser) {
    return <Typography>User not connected</Typography>;
  }

  const user: User = JSON.parse(storedUser) as User;




  return (
    <Container maxWidth="sm">
      <Stack
        spacing={2}
        alignItems="center"
        sx={{
          marginTop: -24,
          textAlign: "center",
        }}
      >

        <Typography variant="h4" fontWeight="bold">
          {user.email}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {user.id}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ marginTop: 2 }} />
      </Stack>
    </Container>
  );
};

export default MyProfilePage;