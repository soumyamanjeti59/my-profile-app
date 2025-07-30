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
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all users from reqres.in API (all pages)
        let apiUsers = [];
        let pageNum = 1;
        let totalPages = 1;
        let totalApiCount = 0;
        do {
          const res = await fetch(`https://reqres.in/api/users?page=${pageNum}&per_page=100`, {
            headers: { 'x-api-key': 'reqres-free-v1' }
          });
          if (!res.ok) throw new Error("API error");
          const apiData = await res.json();
          totalApiCount = apiData.total || 12;
          totalPages = apiData.total_pages || 1;
          const profiles = apiData.data.map((u) => ({
            name: `${u.first_name} ${u.last_name}`,
            email: u.email,
            phone: u.phone || '-',
            company: { name: "Hive Solutions" },
          }));
          apiUsers = apiUsers.concat(profiles.map((profile, idx) => profileToUser(profile, (pageNum-1)*100 + idx)));
          pageNum++;
        } while (pageNum <= totalPages);

        // Get local users from localStorage (from 'users' key)
        let localProfiles = [];
        try {
          const local = JSON.parse(localStorage.getItem('users') || '[]');
          if (Array.isArray(local)) {
            localProfiles = local.map((profile, idx) => profileToUser(profile, apiUsers.length + idx));
          }
        } catch (e) {}

        // Merge API users and local users
        const allUsers = [...apiUsers, ...localProfiles];
        setTotalCount(allUsers.length);

        // Apply pagination to the combined list
        const startIdx = page * rowsPerPage;
        const endIdx = startIdx + rowsPerPage;
        setUsers(allUsers.slice(startIdx, endIdx));
        setLoading(false);
      } catch (err) {
        setError("Failed to load users from API.");
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page, rowsPerPage]);
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // users is already paginated
  const visibleRows = users;

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
    <Paper sx={{ width: "100%", overflowX: "auto", mt: 3 }}>
      <TableContainer sx={{ maxHeight: 440, overflowX: "auto" }}>
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
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
  ;

export default UsersTable;
