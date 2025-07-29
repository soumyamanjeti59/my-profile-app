import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Button,
  Box,
  Container,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import dayjs from "dayjs";

function stringAvatar(name) {
  if (!name) return { children: <PersonIcon /> };
  const parts = name.trim().split(" ");
  return {
    children:
      parts.length === 1
        ? parts[0][0].toUpperCase()
        : (parts[0][0] + parts[1][0]).toUpperCase(),
  };
}

function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const profilesJson = localStorage.getItem("userProfiles");
    if (profilesJson) {
      const profiles = JSON.parse(profilesJson);
      if (profiles.length > 0) {
        setProfile(profiles[profiles.length - 1]);
      }
    }
  }, []);

  if (!profile) {
    return (
      <Container
        maxWidth="M"
        sx={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#123d7d",
        }}
      >
        <Box width="50%">
          <Card
            elevation={10}
            sx={{
              borderRadius: 4,
              bgcolor: "#fff",
              px: 3,
              py: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" gutterBottom>
              No profile found
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Complete your profile to see your details here.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/profile")}
              sx={{ bgcolor: "#123d7d" }}
            >
              Go to Profile
            </Button>
          </Card>
        </Box>
      </Container>
    );
  }

  // Info for display
  const infoFields = [
    { label: "Age", value: profile.age },
    { label: "Phone Number", value: profile.phone },
    {
      label: "Date of Birth",
      value: profile.dob
        ? dayjs(profile.dob, "DD/MM/YYYY", true).isValid()
          ? dayjs(profile.dob, "DD/MM/YYYY").format("DD/MM/YYYY")
          : profile.dob
        : "N/A",
    },
    { label: "Gender", value: profile.gender },
  ];

  // Styles for fields to match your screenshot
  const labelWidth = 130;
  const valueBoxWidth = 200;

  return (
    <Box
      sx={{
        minHeight: "80vh",
        bgcolor: "#123d7d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Card
        elevation={10}
        sx={{
          borderRadius: 4,
          minWidth: 340,
          maxWidth: 420,
          bgcolor: "#fff",
          px: { xs: 2, sm: 4 },
          py: { xs: 2, sm: 3 },
          width: "100%",
        }}
      >
        <CardContent>
          {/* Top Section: Avatar, Name, Email */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={2} mt={1}>
            <Avatar
              sx={{
                bgcolor: "#1565c0",
                width: 60,
                height: 60,
                color: "#fff",
                mb: 1,
                fontSize: 28,
              }}
            >
              {profile.name ? stringAvatar(profile.name).children : <PersonIcon />}
            </Avatar>
            <Typography
              variant="h5"
              fontWeight={700}
              color="#003366"
              align="center"
            >
              {profile.name}
            </Typography>
            <Typography
              variant="h5"
              color="#444"
              align="center"
              sx={{ mb: 1 }}
            >
              {profile.email}
            </Typography>
          </Box>

          {/* Information fields aligned row by row */}
          <Box sx={{ maxWidth: 370, mx: "auto", mt: 1 }}>
            {infoFields.map((field) => (
              <Box
  key={field.label}
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    mb: 2.2,
  }}
>
  <Typography
    sx={{
      width: labelWidth,
      textAlign: "left",
      fontSize: 20,
      color: "text.secondary",
      fontWeight: 500,
    }}
  >
    {field.label}
  </Typography>
  <Box
    px={2}
    py={1}
    sx={{
      background: "#e3ecfa",
      borderRadius: 2,
      width: valueBoxWidth,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",      // <--- here!
      fontWeight: 500,
      color: "#253858",
    }}
  >
    <Typography variant="body1" fontWeight={500}>
      {field.value}
    </Typography>
  </Box>
</Box>

            ))}
          </Box>

          {/* Edit Profile Button */}
          <Box textAlign="center" mt={4}>
            <Button
              variant="contained"
              onClick={() => navigate("/profile")}
              sx={{
                color: "primary",
                borderColor: "#1565c0",
                "&:hover": {  borderColor: "#003366" },
                fontWeight: 700,
              }}
            >
              Edit Profile
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Home;
