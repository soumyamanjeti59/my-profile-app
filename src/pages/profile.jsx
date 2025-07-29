import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Box,
  Avatar,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import PersonIcon from "@mui/icons-material/Person";

function stringAvatar(name) {
  if (!name) return { children: null };
  const parts = name.trim().split(" ");
  return {
    children:
      parts.length === 1
        ? parts[0][0].toUpperCase()
        : (parts[0][0] + parts[1][0]).toUpperCase(),
  };
}

const EMAIL_VALIDATION_API_KEY = "21686e30d21542a1849db28cda4ea88d"; // Your API key here

async function validateEmailAPI(email) {
  const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${EMAIL_VALIDATION_API_KEY}&email=${encodeURIComponent(email)}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("API request failed");

  const data = await response.json();
  // Abstract API returns a "deliverability" field. Valid if === "DELIVERABLE".
  return data.deliverability === "DELIVERABLE";
}

function Profile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const validate = async () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.age || isNaN(formData.age) || formData.age <= 0) {
      newErrors.age = "Valid age required";
    }

    // Basic regex for format first
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email format";
    } else {
      // Now check with Abstract API
      setCheckingEmail(true);
      try {
        const emailValid = await validateEmailAPI(formData.email);
        if (!emailValid) {
          newErrors.email = "Email does not exist or is not deliverable";
        }
      } catch (error) {
        newErrors.email = "Could not validate email, try again later";
        console.error("Email validation API error", error);
      }
      setCheckingEmail(false);
    }

    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Valid 10-digit phone required";
    }

    if (
      !formData.dob ||
      !dayjs(formData.dob, "DD/MM/YYYY", true).isValid() ||
      dayjs(formData.dob, "DD/MM/YYYY").isAfter(dayjs())
    ) {
      newErrors.dob = "Valid past date required (DD/MM/YYYY)";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (checkingEmail) return; // prevent multiple submits while checking email

    const isValid = await validate();
    if (isValid) {
      let profiles = JSON.parse(localStorage.getItem("userProfiles") || "[]");
      profiles.push({
        ...formData,
        dob: formData.dob,
      });
      localStorage.setItem("userProfiles", JSON.stringify(profiles));
      setOpenSnackbar(true);
      setTimeout(() => {
        setOpenSnackbar(false);
        navigate("/");
      }, 1500);
    }
  };

  // Styles (unchanged so your UI looks the same)
  const fieldSx = { mb: 2, bgcolor: "#f5f5f5", "& .MuiInputBase-root": { height: 50 } };
  const labelSx = { fontSize: 18 };

  return (
    <Box
      sx={{
        minHeight: "40vh",
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
          minWidth: 330,
          maxWidth: 420,
          bgcolor: "#fff",
          px: { xs: 2, sm: 4 },
          py: { xs: 2, sm: 3 },
          width: "100%",
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                mb: 2,
                bgcolor: "#1565c0",
                color: "#fff",
                fontSize: 28,
              }}
            >
              {formData.name ? stringAvatar(formData.name).children : <PersonIcon />}
            </Avatar>
            <Typography variant="h5" fontWeight={700} color="#003366" mb={1} align="center">
              Profile Page
            </Typography>
          </Box>
          <Box component="form" noValidate>
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name || ""}
              autoComplete="name"
              required
              sx={fieldSx}
              InputLabelProps={{ shrink: true, sx: labelSx }}
              disabled={checkingEmail}
            />
            <TextField
              label="Email"
              fullWidth
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              error={!!errors.email}
              helperText={errors.email || ""}
              autoComplete="email"
              required
              sx={fieldSx}
              InputLabelProps={{ shrink: true, sx: labelSx }}
              disabled={checkingEmail}
            />
            {checkingEmail && (
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <CircularProgress size={24} />
                <Typography sx={{ ml: 1, alignSelf: "center" }}>Validating email...</Typography>
              </Box>
            )}
            <Box sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  width: "100%",
                  mb: 2,
                }}
              >
                <TextField
                  label="Age"
                  type="number"
                  fullWidth
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: e.target.value })}
                  error={!!errors.age}
                  helperText={errors.age || ""}
                  autoComplete="off"
                  required
                  InputLabelProps={{ shrink: true, sx: labelSx }}
                  sx={{ bgcolor: "#f5f5f5", "& .MuiInputBase-root": { height: 50 } }}
                  disabled={checkingEmail}
                />
                <DatePicker
                  label="Date of Birth"
                  value={formData.dob ? dayjs(formData.dob, "DD/MM/YYYY") : null}
                  onChange={date => {
                    setFormData({
                      ...formData,
                      dob: date && dayjs(date).isValid()
                        ? dayjs(date).format("DD/MM/YYYY")
                        : "",
                    });
                  }}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.dob,
                      helperText: errors.dob || "",
                      required: true,
                      sx: { bgcolor: "#f5f5f5", "& .MuiInputBase-root": { height: 50 } },
                      InputLabelProps: { shrink: true, sx: labelSx },
                      disabled: checkingEmail,
                    },
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  width: "100%",
                  mb: 2,
                }}
              >
                <TextField
                  label="Phone Number"
                  fullWidth
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  error={!!errors.phone}
                  helperText={errors.phone || ""}
                  autoComplete="tel"
                  required
                  InputLabelProps={{ shrink: true, sx: labelSx }}
                  sx={{ bgcolor: "#f5f5f5", "& .MuiInputBase-root": { height: 50 } }}
                  disabled={checkingEmail}
                />
                <TextField
                  label="Gender"
                  select
                  fullWidth
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  error={!!errors.gender}
                  helperText={errors.gender || ""}
                  required
                  InputLabelProps={{ shrink: true, sx: labelSx }}
                  sx={{ bgcolor: "#f5f5f5", "& .MuiInputBase-root": { height: 50 } }}
                  disabled={checkingEmail}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Box>
            </Box>
            <Box textAlign="center" mt={3}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSubmit}
                sx={{ px: 5, bgcolor: "#1565c0" }}
                disabled={checkingEmail}
              >
                Save Profile
              </Button>
            </Box>
          </Box>
        </CardContent>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Profile saved!
          </Alert>
        </Snackbar>
      </Card>
    </Box>
  );
}

export default Profile;
