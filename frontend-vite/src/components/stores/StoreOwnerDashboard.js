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
  Rating,
  Box,
  TableSortLabel,
  useTheme,
  useMediaQuery,
  Divider,
  Chip,
} from "@mui/material";
import axios from "axios";
import StorefrontIcon from "@mui/icons-material/Storefront";
import StarIcon from "@mui/icons-material/Star";

const StoreOwnerDashboard = () => {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/stores/owner/dashboard"
      );
      setStoreData(response.data);
      setError("");
    } catch (err) {
      setError("Error fetching store data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (data, orderBy, order) => {
    return [...data].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      // Handle special cases
      if (orderBy === "User.name") {
        aValue = a.User?.name || "";
        bValue = b.User?.name || "";
      } else if (orderBy === "createdAt") {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      }

      if (order === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
      return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
    });
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!storeData) {
    return <Typography>No store data available</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ display: "flex", alignItems: "center" }}
        >
          <StorefrontIcon sx={{ mr: 2, fontSize: 35 }} />
          Store Dashboard
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Store Info Card */}
        <Grid item xs={12}>
          <Card
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {storeData.store.name}
                  </Typography>
                  <Typography color="textSecondary" sx={{ mb: 2 }}>
                    {storeData.store.address}
                  </Typography>
                </Box>
                <Chip
                  icon={<StarIcon />}
                  label={`${
                    storeData.store.averageRating?.toFixed(1) || "No"
                  } Rating`}
                  color="primary"
                  sx={{ height: "auto", p: 1, borderRadius: 2 }}
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Rating
                  value={storeData.store.averageRating || 0}
                  readOnly
                  precision={0.1}
                  size="large"
                />
                <Typography variant="h6" sx={{ ml: 2 }}>
                  ({storeData.store.averageRating?.toFixed(1) || "No ratings"})
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics Cards */}
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              height: "100%",
              transition: "transform 0.2s, box-shadow 0.2s",
              borderRadius: 2,
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography color="textSecondary" gutterBottom>
                Total Ratings
              </Typography>
              <Typography variant="h4">
                {storeData.store.Ratings?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Rating Card */}
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              height: "100%",
              transition: "transform 0.2s, box-shadow 0.2s",
              borderRadius: 2,
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography color="textSecondary" gutterBottom>
                Average Rating
              </Typography>
              <Typography variant="h4">
                {storeData.store.averageRating?.toFixed(1) || "N/A"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Latest Rating Card */}
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              height: "100%",
              transition: "transform 0.2s, box-shadow 0.2s",
              borderRadius: 2,
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography color="textSecondary" gutterBottom>
                Latest Rating
              </Typography>
              <Typography variant="h4">
                {storeData.store.Ratings?.[0]?.rating || "N/A"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Ratings Table */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              overflowX: "auto",
              borderRadius: 2,
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
              },
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Customer Ratings
            </Typography>
            <TableContainer>
              <Table
                size={isMobile ? "small" : "medium"}
                sx={{
                  "& .MuiTableCell-root": {
                    borderBottom: "1px solid rgba(224, 224, 224, 0.4)",
                  },
                  "& .MuiTableRow-root:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "User.name"}
                        direction={orderBy === "User.name" ? order : "asc"}
                        onClick={() => handleSort("User.name")}
                      >
                        Customer
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "rating"}
                        direction={orderBy === "rating" ? order : "asc"}
                        onClick={() => handleSort("rating")}
                      >
                        Rating
                      </TableSortLabel>
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "createdAt"}
                          direction={orderBy === "createdAt" ? order : "asc"}
                          onClick={() => handleSort("createdAt")}
                        >
                          Date
                        </TableSortLabel>
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortData(storeData.store.Ratings || [], orderBy, order).map(
                    (rating) => (
                      <TableRow key={rating.id}>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {rating.User.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            display="block"
                            color="textSecondary"
                          >
                            {rating.User.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Rating
                              value={rating.rating}
                              readOnly
                              size="small"
                            />
                            <Typography sx={{ ml: 1 }}>
                              ({rating.rating})
                            </Typography>
                          </Box>
                        </TableCell>
                        {!isMobile && (
                          <TableCell>
                            {new Date(rating.createdAt).toLocaleDateString()}
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StoreOwnerDashboard;
