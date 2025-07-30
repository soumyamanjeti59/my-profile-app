
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
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

// Helper: calculate age from "DD/MM/YYYY" string
function getAgeFromDOB(dobStr) {
  if (!dobStr || !dayjs(dobStr, "DD/MM/YYYY", true).isValid()) return "";
  const dob = dayjs(dobStr, "DD/MM/YYYY");
  const today = dayjs();
  let age = today.year() - dob.year();
  if (
    today.month() < dob.month() ||
    (today.month() === dob.month() && today.date() < dob.date())
  ) {
    age--; // birthday not passed this year
  }
  return age > 0 ? String(age) : "";
}

// Helper: get DOB string for a given age, defaulting to today's month/day
function getDOBFromAge(age) {
  const n = Number(age);
  if (!n || n <= 0) return "";
  const today = dayjs();
  return today.subtract(n, "year").format("DD/MM/YYYY");
}

// Helper for Avatar initials
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

// Dummy email API key (replace with your own if necessary)
const EMAIL_VALIDATION_API_KEY = "e9ef06013f0347ada9eb9788d6cde246";

// Email validation API
async function validateEmailAPI(email) {
  const url = `https://api.zerobounce.net/v2/validate?api_key=${EMAIL_VALIDATION_API_KEY}&email=${email}`
  const response = await fetch(url);
  if (!response.ok) throw new Error("API request failed");
  const data = await response.json();
  return data.status === "valid";
}

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to get the latest user from localStorage
  function getLatestUser() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.length === 0) return {
      name: "",
      age: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
    };
    return users[users.length - 1];
  }

  // If location.state?.edit, prefill, else empty
  const [formData, setFormData] = useState(
    location.state && location.state.edit ? getLatestUser() : {
      name: "",
      age: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
    }
  );

  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Handle DOB field
  const handleDOBChange = (date) => {
    let dobString = "";
    if (date && dayjs(date).isValid()) {
      dobString = dayjs(date).format("DD/MM/YYYY");
    }
    const newAge = getAgeFromDOB(dobString);
    setFormData((prev) => ({
      ...prev,
      dob: dobString,
      age: newAge,
    }));
  };

  // Handle Age field
  const handleAgeChange = (e) => {
    const val = e.target.value;
    let numericAge = val.replace(/\D/g, "");
    if (numericAge.length > 3) numericAge = numericAge.slice(0, 3);
    const dobString = getDOBFromAge(numericAge);
    setFormData((prev) => ({
      ...prev,
      age: numericAge,
      dob: dobString,
    }));
  };

  const validate = async () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.age || isNaN(formData.age) || Number(formData.age) <= 0) {
      newErrors.age = "Valid age required";
    }

    // Validate DOB
    if (
      !formData.dob ||
      !dayjs(formData.dob, "DD/MM/YYYY", true).isValid() ||
      dayjs(formData.dob, "DD/MM/YYYY").isAfter(dayjs())
    ) {
      newErrors.dob = "Valid past date required (DD/MM/YYYY)";
    }

    // Age-DOB sync
    if (
      !newErrors.age &&
      !newErrors.dob &&
      getAgeFromDOB(formData.dob) !== String(Number(formData.age))
    ) {
      newErrors.age = "Age and DOB mismatch";
      newErrors.dob = "Age and DOB mismatch";
    }

    // Validate Email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email format";
    } else {
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

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (checkingEmail) return;
    const isValid = await validate();
    if (isValid) {
      // ID assignment and save
      let users = JSON.parse(localStorage.getItem("users") || "[]");
      let nextId = 1;
      if (users.length > 0) {
        const ids = users.map((u) => u.id || 0);
        nextId = Math.max(...ids) + 1;
      }
      const newUser = {
        ...formData,
        dob: formData.dob,
        age: formData.age,
      };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      setOpenSnackbar(true);
      setTimeout(() => {
        setOpenSnackbar(false);
        navigate("/"); // Redirect to Home page
      }, 1500);
    }
  };

  const fieldSx = {
    mb: 2,
    bgcolor: "#003366",
    '& .MuiInputBase-root': { height: 50, color: '#e3ecfa', backgroundColor: '#003366' },
    '& .MuiInputBase-input': { color: '#e3ecfa !important', backgroundColor: '#003366' },
    '& .MuiFormLabel-root': { color: '#e3ecfa' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e3ecfa' },
  };
  const labelSx = { fontSize: 18, color: '#e3ecfa' };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: '100vh',
        bgcolor: "#123d7d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 0,
        px: { xs: 2, sm: 4 },
        overflow: 'hidden',
      }}
    >
      <Box sx={{ width: { xs: "100%", sm: 420 }, maxWidth: 420, mx: "auto" }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              mb: 2,
              bgcolor: "#1565c0",
              color: "#fff",
              fontSize: 28,
              border: "2px solid #fff",
            }}
          >
            {formData.name ? stringAvatar(formData.name).children : <PersonIcon />}
          </Avatar>
          <Typography variant="h5" fontWeight={700} color="#e3ecfa" mb={1} align="center">
            Profile Page
          </Typography>
        </Box>
        <Box component="form" noValidate>
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  onChange={handleAgeChange}
                  error={!!errors.age}
                  helperText={errors.age || ""}
                  autoComplete="off"
                  required
                  InputLabelProps={{ shrink: true, sx: labelSx }}
                  sx={{
                    ...fieldSx,
                    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0,
                    },
                    '& input[type=number]': {
                      MozAppearance: 'textfield',
                    },
                  }}
                  disabled={checkingEmail}
                />
                <DatePicker
                  label="Date of Birth"
                  value={formData.dob ? dayjs(formData.dob, "DD/MM/YYYY") : null}
                  onChange={handleDOBChange}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      error: !!errors.dob,
                      helperText: errors.dob || "",
                      required: true,
                      sx: {
                        ...fieldSx,
                        '& .MuiSvgIcon-root': { color: '#fff' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
                      },
                      InputLabelProps: {
                        shrink: true,
                        sx: labelSx,
                      },
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
                  width: "100%",
                  mb: 2,
                }}
              >
                <TextField
                  label="Phone"
                  fullWidth
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                  }
                  error={!!errors.phone}
                  helperText={errors.phone || ""}
                  required
                  sx={fieldSx}
                  InputLabelProps={{ shrink: true, sx: { ...labelSx, color: "#fff" } }}
                  disabled={checkingEmail}
                />
                <TextField
                  label="Gender"
                  select
                  fullWidth
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  error={!!errors.gender}
                  helperText={errors.gender || ""}
                  required
                  sx={{
                    ...fieldSx,
                    "& .MuiSelect-icon": { color: "#fff" },
                  }}
                  InputLabelProps={{ shrink: true, sx: { ...labelSx, color: "#fff" } }}
                  disabled={checkingEmail}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Box>
            </Box>
            {checkingEmail && (
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <CircularProgress size={24} />
                <Typography sx={{ ml: 1, alignSelf: "center" }}>Validating email...</Typography>
              </Box>
            )}
            <Box sx={{ flexGrow: 1 }}>
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
          </Box>
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
      </Box>
    </Box>
  );
}

export default Profile;
