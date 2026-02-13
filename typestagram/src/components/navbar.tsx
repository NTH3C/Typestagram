import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user"); // ou ton AuthContext

  const handleLogout = () => {
    navigate("/logout")
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        backgroundColor: "#fff",
        color: "#000",
        borderBottom: "1px solid #dbdbdb",
        width: "100vw",
        margin: "0",
        padding: "0"
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          component={Link}
          to="/"
          sx={{
            fontFamily: "cursive",
            fontSize: 26,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          Typestagram
        </Typography>

        {/* Search */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            backgroundColor: "#efefef",
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            minWidth: 250,
          }}
        >
          <SearchIcon sx={{ color: "#8e8e8e", mr: 1 }} />
          <InputBase placeholder="Rechercher" />
        </Box>

        {/* Icons */}
        <Box>
          <IconButton component={Link} to="/">
            <HomeIcon />
          </IconButton>

          {user && (
            <IconButton component={Link} to="/feed">
              <AddBoxOutlinedIcon />
            </IconButton>
          )}

          {user ? (
            <>
              <IconButton component={Link} to="/myprofile">
                <PersonOutlineIcon />
              </IconButton>

              <IconButton onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <IconButton component={Link} to="/login">
              <LoginIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;