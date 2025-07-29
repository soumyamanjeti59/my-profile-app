import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  CircularProgress,
  Alert,
  Typography,
  Box,
} from "@mui/material";

function profileToUser(profile, idx) {
  return {
    id: 1 + idx, // Just a simple incremental id
    name: profile.name,
    username: profile.name && profile.name.split(" ")[0],
    email: profile.email,
    phone: profile.phone,
    company: { name: "Hive Solutions" },
  };
}

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  useEffect(() => {
    // Load users strictly from localStorage, no external fetch to avoid network errors
    setLoading(true);
    setError(null);

    try {
      let profiles = [];
      const profileArrJson = localStorage.getItem("userProfiles");

      if (profileArrJson) {
        profiles = JSON.parse(profileArrJson);
      } else {
        // Try legacy key fallback
        const oldProfile = localStorage.getItem("profileData");
        if (oldProfile) {
          profiles = [JSON.parse(oldProfile)];
          localStorage.setItem("userProfiles", JSON.stringify(profiles));
        }
      }

      // Map profiles to user-format
      const profileUsers = profiles.map((profile, idx) =>
        profileToUser(profile, idx)
      );

      setUsers(profileUsers);
      setLoading(false);
    } catch (err) {
      setError("Failed to load users from local storage.");
      setLoading(false);
    }
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Slice users for pagination
  const visibleRows = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography mt={2}>Loading users...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", mt: 3 }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Username</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Phone</b></TableCell>
              <TableCell><b>Company</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((user, idx) => (
                <TableRow hover key={user.id || idx}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.company?.name || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default UsersTable;
