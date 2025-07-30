import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import UsersTable from "../components/userstable";

function UsersPage() {
  return (
    <Box
      sx={{
        minHeight: "75vh",
        bgcolor: "#123d7d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        width: "100%",
        px: { xs: 2, sm: 0 },
      }}
    >
      <Box
        sx={{
          width: { xs: "95%", sm: 700 },
          maxWidth: 700,
          px: 3,
          py: 3,
        }}
      >
        <Box display="flex" alignItems="center" mb={2} gap={1} flexWrap="wrap">
          <PeopleAltIcon sx={{ color: "#e3ecfa", fontSize: 28 }} />
          <Typography variant="h5" fontWeight={700} color="#e3ecfa" noWrap>
            Users List
          </Typography>
        </Box>
        <UsersTable />
      </Box>
    </Box>
  );
}

export default UsersPage;
