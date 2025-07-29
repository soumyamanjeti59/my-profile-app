import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Stack } from '@mui/material';
import HiveIcon from '@mui/icons-material/Hive';


function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <HiveIcon sx={{ flexGrow: 0, color: "#003366", fontSize: 45 }} />
        <Typography variant="h5" sx={{ flexGrow: 1 }} >
          HIVE
        </Typography>
        <Stack direction="row" spacing={2}>
        <Button color="inherit" variant="outlined" size="small" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" variant="outlined" size="small" component={Link} to="/profile">
          Profile
        </Button>
        <Button color="inherit" variant="outlined" size="small" component={Link} to="/users">
          Users
        </Button>
      </Stack>
    </Toolbar>
  </AppBar>
  );
}

export default Navbar;
