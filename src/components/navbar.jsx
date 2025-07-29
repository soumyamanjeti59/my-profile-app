import React from "react";
import { AppBar, Toolbar, Typography, Button, Stack, Box } from "@mui/material";
import { Link } from "react-router-dom";
import HiveIcon from '@mui/icons-material/Hive';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          flexDirection: { xs: "column", sm: "row" }, // stack on xs, row for sm+
          alignItems: { xs: "stretch", sm: "center" },
          px: { xs: 1, sm: 3 },
          py: { xs: 1, sm: 0 },
          gap: { xs: 1, sm: 0 }
        }}
      >
        {/* Brand Section */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <HiveIcon
            sx={{
              flexGrow: 0,
              color: "#003366",
              fontSize: { xs: 30, sm: 40, md: 45 },
              mr: 1
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.2rem", sm: "1.5rem", md: "h5.fontSize" }
            }}
            noWrap
          >
            HIVE
          </Typography>
        </Box>
        {/* Buttons Aligned Right */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "space-between", sm: "flex-end" },
            flexWrap: "wrap",  // allow wrapping on small screens
          }}
        >
          <Button
            color="primary"
            variant="contained"
            size="small"
            component={Link}
            to="/"
            sx={{
              backgroundColor: "#123d7d",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#003366",
              },
              fontWeight: 700,
              letterSpacing: 1,
              whiteSpace: "nowrap" // prevent text wrapping inside button
            }}
          >
            HOME
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="small"
            component={Link}
            to="/profile"
            sx={{
              backgroundColor: "#123d7d",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#003366",
              },
              fontWeight: 700,
              letterSpacing: 1,
              whiteSpace: "nowrap"
            }}
          >
            PROFILE
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="small"
            component={Link}
            to="/users"
            sx={{
              backgroundColor: "#123d7d",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#003366",
              },
              fontWeight: 700,
              letterSpacing: 1,
              whiteSpace: "nowrap"
            }}
          >
            USERS
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
