import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  TableSortLabel,
  useTheme,
  useMediaQuery,
  Fab,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";
import StoreIcon from "@mui/icons-material/Store";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editingStore, setEditingStore] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Sorting function
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (data, orderBy, order) => {
    return [...data].sort((a, b) => {
      const aValue = a[orderBy]?.toString().toLowerCase() || "";
      const bValue = b[orderBy]?.toString().toLowerCase() || "";
      if (order === "asc") {
        return aValue.localeCompare(bValue);
      }
      return bValue.localeCompare(aValue);
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, usersResponse, storesResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/users/dashboard"),
        axios.get("http://localhost:5000/api/users"),
        axios.get("http://localhost:5000/api/stores"),
      ]);

      setStats(statsResponse.data);
      setUsers(usersResponse.data);
      setStores(storesResponse.data);
      setError("");
    } catch (err) {
      setError("Error fetching dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}/role`, {
        role: newRole,
      });
      fetchDashboardData();
      setEditingUser(null);
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      fetchDashboardData();
      setConfirmDelete(null);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleUpdateStore = async (storeId, storeData) => {
    try {
      await axios.put(`http://localhost:5000/api/stores/${storeId}`, storeData);
      fetchDashboardData();
      setEditingStore(null);
    } catch (err) {
      console.error("Error updating store:", err);
    }
  };

  const handleDeleteStore = async (storeId) => {
    try {
      await axios.delete(`http://localhost:5000/api/stores/${storeId}`);
      fetchDashboardData();
      setConfirmDelete(null);
    } catch (err) {
      console.error("Error deleting store:", err);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: { xs: 2, sm: 3, md: 4 },
        mb: { xs: 2, sm: 3, md: 4 },
        position: "relative",
        px: { xs: 2, sm: 3 }, // Add padding on smaller screens
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
            fontWeight: 600,
          }}
        >
          Admin Dashboard
        </Typography>
        {!isMobile && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/stores/create")}
            sx={{
              height: { xs: 36, sm: 40 },
              borderRadius: 2,
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
              },
            }}
          >
            Create Store
          </Button>
        )}
      </Box>

      {/* Statistics Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: { xs: 2, sm: 3 },
          mb: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Card
          sx={{
            borderRadius: { xs: 1, sm: 2 },
            boxShadow: 2,
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 4,
            },
          }}
        >
          <CardContent
            sx={{
              p: { xs: 2, sm: 3 },
              "&:last-child": { pb: { xs: 2, sm: 3 } },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
              }}
            >
              <PeopleIcon
                sx={{
                  fontSize: { xs: 32, sm: 40 },
                  color: "primary.main",
                }}
              />
              <Box>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                >
                  Total Users
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
                    fontWeight: 600,
                  }}
                >
                  {stats.totalUsers}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            borderRadius: { xs: 1, sm: 2 },
            boxShadow: 2,
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 4,
            },
          }}
        >
          <CardContent
            sx={{
              p: { xs: 2, sm: 3 },
              "&:last-child": { pb: { xs: 2, sm: 3 } },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
              }}
            >
              <StoreIcon
                sx={{
                  fontSize: { xs: 32, sm: 40 },
                  color: "primary.main",
                }}
              />
              <Box>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                >
                  Total Stores
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
                    fontWeight: 600,
                  }}
                >
                  {stats.totalStores}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            borderRadius: { xs: 1, sm: 2 },
            boxShadow: 2,
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 4,
            },
          }}
        >
          <CardContent
            sx={{
              p: { xs: 2, sm: 3 },
              "&:last-child": { pb: { xs: 2, sm: 3 } },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
              }}
            >
              <StarIcon
                sx={{
                  fontSize: { xs: 32, sm: 40 },
                  color: "primary.main",
                }}
              />
              <Box>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                >
                  Total Ratings
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
                    fontWeight: 600,
                  }}
                >
                  {stats.totalRatings}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Users Table */}
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          mb: { xs: 2, sm: 3 },
          overflowX: "auto",
          borderRadius: { xs: 1, sm: 2 },
          boxShadow: 2,
          "&:hover": {
            boxShadow: 4,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: { xs: 2, sm: 3 },
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            Users
          </Typography>
          <TextField
            placeholder="Search users..."
            size={isMobile ? "small" : "medium"}
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: { xs: "100%", sm: "300px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: { xs: 1, sm: 2 },
              },
            }}
          />
        </Box>
        <TableContainer>
          <Table
            size={isMobile ? "small" : "medium"}
            sx={{
              "& .MuiTableCell-root": {
                borderBottom: "1px solid rgba(224, 224, 224, 0.4)",
                padding: {
                  xs: "8px 4px",
                  sm: "16px 8px",
                  md: "16px",
                },
                fontSize: {
                  xs: "0.875rem",
                  sm: "1rem",
                },
              },
              "& .MuiTableRow-root:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
              "& .MuiTableHead-root .MuiTableCell-root": {
                fontWeight: 600,
                backgroundColor: "rgba(0, 0, 0, 0.02)",
                whiteSpace: "nowrap",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleSort("name")}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "email"}
                    direction={orderBy === "email" ? order : "asc"}
                    onClick={() => handleSort("email")}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                {!isMobile && (
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "role"}
                      direction={orderBy === "role" ? order : "asc"}
                      onClick={() => handleSort("role")}
                    >
                      Role
                    </TableSortLabel>
                  </TableCell>
                )}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortData(filteredUsers, orderBy, order).map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  {!isMobile && <TableCell>{user.role}</TableCell>}
                  <TableCell align="right">
                    <IconButton
                      onClick={() => setEditingUser(user)}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        setConfirmDelete({ type: "user", id: user.id })
                      }
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Stores Table */}
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          overflowX: "auto",
          borderRadius: { xs: 1, sm: 2 },
          boxShadow: 2,
          "&:hover": {
            boxShadow: 4,
          },
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
          }}
        >
          Stores
        </Typography>
        <TableContainer>
          <Table
            size={isMobile ? "small" : "medium"}
            sx={{
              "& .MuiTableCell-root": {
                borderBottom: "1px solid rgba(224, 224, 224, 0.4)",
                padding: {
                  xs: "8px 4px",
                  sm: "16px 8px",
                  md: "16px",
                },
                fontSize: {
                  xs: "0.875rem",
                  sm: "1rem",
                },
              },
              "& .MuiTableRow-root:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
              "& .MuiTableHead-root .MuiTableCell-root": {
                fontWeight: 600,
                backgroundColor: "rgba(0, 0, 0, 0.02)",
                whiteSpace: "nowrap",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleSort("name")}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "email"}
                    direction={orderBy === "email" ? order : "asc"}
                    onClick={() => handleSort("email")}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                {!isMobile && (
                  <>
                    <TableCell>Address</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "averageRating"}
                        direction={orderBy === "averageRating" ? order : "asc"}
                        onClick={() => handleSort("averageRating")}
                      >
                        Average Rating
                      </TableSortLabel>
                    </TableCell>
                  </>
                )}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortData(stores, orderBy, order).map((store) => (
                <TableRow key={store.id}>
                  <TableCell>{store.name}</TableCell>
                  <TableCell>{store.email}</TableCell>
                  {!isMobile && (
                    <>
                      <TableCell>{store.address}</TableCell>
                      <TableCell>{store.owner?.name}</TableCell>
                      <TableCell>
                        {store.averageRating?.toFixed(1) || "No ratings"}
                      </TableCell>
                    </>
                  )}
                  <TableCell align="right">
                    <IconButton
                      onClick={() => setEditingStore(store)}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        setConfirmDelete({ type: "store", id: store.id })
                      }
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onClose={() => setEditingUser(null)}>
        <DialogTitle>Edit User Role</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={editingUser?.role || ""}
              label="Role"
              onChange={(e) =>
                handleUpdateUserRole(editingUser.id, e.target.value)
              }
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="store_owner">Store Owner</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingUser(null)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Store Dialog */}
      <Dialog open={!!editingStore} onClose={() => setEditingStore(null)}>
        <DialogTitle>Edit Store</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={editingStore?.name || ""}
            onChange={(e) =>
              setEditingStore({ ...editingStore, name: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={editingStore?.email || ""}
            onChange={(e) =>
              setEditingStore({ ...editingStore, email: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Address"
            value={editingStore?.address || ""}
            onChange={(e) =>
              setEditingStore({ ...editingStore, address: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Owner</InputLabel>
            <Select
              value={editingStore?.ownerId || ""}
              label="Owner"
              onChange={(e) =>
                setEditingStore({ ...editingStore, ownerId: e.target.value })
              }
            >
              {users
                .filter((user) => user.role === "store_owner")
                .map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingStore(null)}>Cancel</Button>
          <Button
            onClick={() =>
              handleUpdateStore(editingStore.id, {
                name: editingStore.name,
                email: editingStore.email,
                address: editingStore.address,
                ownerId: editingStore.ownerId,
              })
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {confirmDelete?.type}? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button
            color="error"
            onClick={() =>
              confirmDelete?.type === "user"
                ? handleDeleteUser(confirmDelete.id)
                : handleDeleteStore(confirmDelete.id)
            }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mobile FAB */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add store"
          sx={{
            position: "fixed",
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            boxShadow: 3,
          }}
          onClick={() => navigate("/admin/stores/create")}
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  );
};

export default Dashboard;
