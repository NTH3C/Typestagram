import React from "react";
import { Avatar, Typography, Button, Stack, Container } from "@mui/material";

const MyProfilePage = ({
  name,
  bio,
  avatarUrl,
  onFollow,
  onMessage,
}: {
  name: string;
  bio: string;
  avatarUrl: string;
  onFollow?: () => void;
  onMessage?: () => void;
}) => {
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
        <Avatar
          src={avatarUrl}
          alt={name}
          sx={{
            width: 120,
            height: 120,
            border: "4px solid white",
          }}
        />

        <Typography variant="h4" fontWeight="bold">
          {name}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {bio}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
          <Button variant="contained" onClick={onFollow}>
            Follow
          </Button>
          <Button variant="outlined" onClick={onMessage}>
            Message
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default MyProfilePage;
