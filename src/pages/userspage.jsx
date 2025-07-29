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
        width: "100%"
      }}
    >
      <Card
        elevation={10}
        sx={{
          borderRadius: 7,
          bgcolor: "#fff",
          minWidth: 340,
          maxWidth: 700,
          px: 3,
          py: 3,
          width: "100%",
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" mb={2} gap={1}>
            <PeopleAltIcon sx={{ color: "#003366", fontSize: 28 }} />
            <Typography variant="h5" fontWeight={700} color="#003366">
              Users List
            </Typography>
          </Box>
          <UsersTable />
        </CardContent>
      </Card>
    </Box>
  );
}

export default UsersPage;
